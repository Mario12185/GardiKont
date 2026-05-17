import { pdf, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Charger une police compatible (optionnel mais recommandé pour le français)
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZg.ttf' })

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottom: '1 solid #0f172a', paddingBottom: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 11, color: '#64748b' },
  section: { marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontWeight: 'bold', width: '40%' },
  value: { width: '60%', textAlign: 'right' },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, fontSize: 8, color: '#64748b', borderTop: '1 solid #e2e8f0', paddingTop: 10 },
  hash: { fontFamily: 'Courier', fontSize: 8, wordBreak: 'break-all', backgroundColor: '#f1f5f9', padding: 4, borderRadius: 3, marginTop: 5 }
})

export const generateValidationPDF = async (validation, service, site, client) => {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>GardiKont — Attestation de Validation</Text>
          <Text style={styles.subtitle}>Preuve numérique de prestation de gardiennage</Text>
        </View>

        {/* Infos client */}
        <View style={styles.section}>
          <View style={styles.row}><Text style={styles.label}>Client :</Text><Text style={styles.value}>{client?.company_name || client?.email}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Email :</Text><Text style={styles.value}>{client?.email}</Text></View>
        </View>

        {/* Infos service */}
        <View style={styles.section}>
          <View style={styles.row}><Text style={styles.label}>Société de sécurité :</Text><Text style={styles.value}>{site?.security_company}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Site :</Text><Text style={styles.value}>{site?.name}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Adresse :</Text><Text style={styles.value}>{site?.address}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Date :</Text><Text style={styles.value}>{new Date(service.date).toLocaleDateString('fr-FR')}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Horaires :</Text><Text style={styles.value}>{service.start_time} - {service.end_time} ({service.duration_hours}h)</Text></View>
        </View>

        {/* Validation */}
        <View style={styles.section}>
          <View style={styles.row}><Text style={styles.label}>Statut :</Text><Text style={styles.value}>{validation.status === 'validated' ? '✅ Validé' : '⚠️ Contesté'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Validé le :</Text><Text style={styles.value}>{new Date(validation.validated_at).toLocaleString('fr-FR')}</Text></View>
          {validation.comment && <View style={styles.row}><Text style={styles.label}>Commentaire :</Text><Text style={styles.value}>{validation.comment}</Text></View>}
        </View>

        {/* Preuve technique */}
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Empreinte numérique (SHA-256)</Text>
          <Text style={styles.hash}>{validation.sha256_hash}</Text>
        </View>

        {/* Pied de page légal */}
        <View style={styles.footer}>
          <Text>Ce document constitue une attestation de validation client générée par GardiKont.</Text>
          <Text>Horodatage serveur : {new Date(validation.validated_at).toISOString()}</Text>
          <Text>Valeur probante : Pour une force juridique renforcée, associer une signature électronique qualifiée conforme aux normes OHADA / BCEAO.</Text>
          <Text>Archivage : Conservé 5 ans minimum. Export disponible dans l'espace client.</Text>
          <Text style={{ marginTop: 5, textAlign: 'center' }}>GardiKont © {new Date().getFullYear()} — https://gardikont.app</Text>
        </View>
      </Page>
    </Document>
  )
  return pdf(doc).toBlob()
}