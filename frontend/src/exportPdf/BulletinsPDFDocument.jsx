import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

// Styles pour le PDF
const styles = StyleSheet.create({
  document: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  titleSection: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 11,
    color: '#6b7280',
  },
  infoSection: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 40,
    flexWrap: 'wrap',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoLabel: {
    fontSize: 9,
    color: '#9ca3af',
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 11,
    color: '#1f2937',
    fontWeight: '500',
  },
  tableContainer: {
    marginBottom: 20,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'solid',
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    color: '#ffffff',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableRowEven: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 9,
    color: '#1f2937',
  },
  tableCellHeader: {
    flex: 1,
    padding: 10,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    textAlign: 'center',
    fontSize: 9,
    color: '#6b7280',
  },
  emptyMessage: {
    textAlign: 'center',
    padding: 20,
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusGenere: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  statusPaye: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
})

const getStatutStyle = (statut) => {
  switch (statut) {
    case 'GENERE':
      return { ...styles.statusBadge, ...styles.statusGenere }
    case 'PAYE':
      return { ...styles.statusBadge, ...styles.statusPaye }
    default:
      return styles.statusBadge
  }
}

export default function BulletinsPDFDocument({ bulletins, employes, logoUrl }) {
  const now = new Date()
  const dateFormatted = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const timeFormatted = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(value || 0)
  }

  return (
    <Document>
      <Page size="A4" style={styles.document}>
        {/* Header */}
        <View style={styles.header}>
          {logoUrl && (
            <View style={styles.logoContainer}>
              <Image src={logoUrl} style={styles.logoImage} />
            </View>
          )}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Liste des Bulletins de Paie</Text>
            <Text style={styles.subtitle}>
              Document généré automatiquement
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Total</Text>
            <Text style={styles.infoValue}>{bulletins?.length || 0} bulletin(s)</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Heure génération</Text>
            <Text style={styles.infoValue}>{timeFormatted}</Text>
          </View>
        </View>

        {/* Table */}
        {bulletins && bulletins.length > 0 ? (
          <View style={styles.tableContainer}>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={{ ...styles.tableCellHeader, flex: 1 }}>
                  Employé
                </Text>
                <Text style={{ ...styles.tableCellHeader, flex: 0.8 }}>
                  Mois
                </Text>
                <Text style={{ ...styles.tableCellHeader, flex: 1 }}>
                  Salaire Brut
                </Text>
                <Text style={{ ...styles.tableCellHeader, flex: 1 }}>
                  Retenues
                </Text>
                <Text style={{ ...styles.tableCellHeader, flex: 1 }}>
                  Net à Payer
                </Text>
                <Text style={{ ...styles.tableCellHeader, flex: 0.8 }}>
                  Statut
                </Text>
              </View>

              {/* Table Body */}
              {bulletins.map((bulletin, index) => {
                const emp = employes?.find((e) => e.id === bulletin.employeId)
                const empName = emp
                  ? `${emp.nom} ${emp.prenom}`
                  : `Employé #${bulletin.employeId}`

                return (
                  <View
                    key={bulletin.id}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 ? styles.tableRowEven : {},
                    ]}
                  >
                    <Text style={{ ...styles.tableCell, flex: 1 }}>
                      {empName}
                    </Text>
                    <Text style={{ ...styles.tableCell, flex: 0.8 }}>
                      {bulletin.mois || '-'}
                    </Text>
                    <Text style={{ ...styles.tableCell, flex: 1 }}>
                      {formatCurrency(bulletin.salaire_brut)}
                    </Text>
                    <Text style={{ ...styles.tableCell, flex: 1 }}>
                      {formatCurrency(bulletin.retenues)}
                    </Text>
                    <Text style={{ ...styles.tableCell, flex: 1 }}>
                      {formatCurrency(bulletin.net_a_payer)}
                    </Text>
                    <Text
                      style={{
                        ...getStatutStyle(bulletin.statut),
                        flex: 0.8,
                      }}
                    >
                      {bulletin.statut || '-'}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        ) : (
          <Text style={styles.emptyMessage}>Aucun bulletin enregistré</Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Document généré le {dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)} à {timeFormatted}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
