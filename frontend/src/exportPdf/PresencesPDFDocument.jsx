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
  statsSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 10,
    borderRight: 1,
    borderRightColor: '#d1d5db',
  },
  statItemLast: {
    borderRight: 'none',
  },
  statLabel: {
    fontSize: 9,
    color: '#6b7280',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
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
  tableCellNumeric: {
    textAlign: 'center',
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
  statusPresent: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  statusAbsent: {
    backgroundColor: '#fee2e2',
    color: '#7f1d1d',
  },
  statusRetard: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
})

const getStatutStyle = (statut) => {
  switch (statut) {
    case 'PRESENT':
      return { ...styles.statusBadge, ...styles.statusPresent }
    case 'ABSENT':
      return { ...styles.statusBadge, ...styles.statusAbsent }
    case 'RETARD':
      return { ...styles.statusBadge, ...styles.statusRetard }
    default:
      return styles.statusBadge
  }
}

export default function PresencesPDFDocument({ presences, employes, logoUrl, selectedDate }) {
  const now = new Date()
  const dateFormatted = selectedDate
    ? new Date(selectedDate).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : now.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

  const timeFormatted = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // Statistiques
  const stats = {
    total: presences.length,
    presents: presences.filter(p => p.statut === 'PRESENT').length,
    absents: presences.filter(p => p.statut === 'ABSENT').length,
    retards: presences.filter(p => p.statut === 'RETARD').length,
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
            <Text style={styles.mainTitle}>Liste des Présences</Text>
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
            <Text style={styles.infoLabel}>Heure génération</Text>
            <Text style={styles.infoValue}>{timeFormatted}</Text>
          </View>
        </View>

        {/* Stats Section */}
        {presences && presences.length > 0 && (
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{stats.total}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Présents</Text>
              <Text style={{ ...styles.statValue, color: '#10b981' }}>
                {stats.presents}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Absents</Text>
              <Text style={{ ...styles.statValue, color: '#ef4444' }}>
                {stats.absents}
              </Text>
            </View>
            <View style={{ ...styles.statItem, ...styles.statItemLast }}>
              <Text style={styles.statLabel}>Retards</Text>
              <Text style={{ ...styles.statValue, color: '#f59e0b' }}>
                {stats.retards}
              </Text>
            </View>
          </View>
        )}

        {/* Table */}
        {presences && presences.length > 0 ? (
          <View style={styles.tableContainer}>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={{ ...styles.tableCellHeader, flex: 0.5, ...styles.tableCellNumeric }}>
                  #
                </Text>
                <Text style={{ ...styles.tableCellHeader, flex: 2 }}>
                  Employé
                </Text>
                <Text style={{ ...styles.tableCellHeader, flex: 1, ...styles.tableCellNumeric }}>
                  Statut
                </Text>
                <Text style={{ ...styles.tableCellHeader, flex: 1, ...styles.tableCellNumeric }}>
                  Heures
                </Text>
                <Text style={{ ...styles.tableCellHeader, flex: 1.5 }}>
                  Justification
                </Text>
                <Text style={{ ...styles.tableCellHeader, flex: 1 }}>
                  Heure
                </Text>
              </View>

              {/* Table Body */}
              {presences.map((presence, index) => {
                const emp = employes?.find((e) => e.id === presence.employeId)
                const empName = emp
                  ? `${emp.nom} ${emp.prenom}`
                  : `Employé #${presence.employeId}`

                return (
                  <View
                    key={presence.id}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 ? styles.tableRowEven : {},
                    ]}
                  >
                    <Text
                      style={{
                        ...styles.tableCell,
                        flex: 0.5,
                        ...styles.tableCellNumeric,
                      }}
                    >
                      {index + 1}
                    </Text>
                    <Text style={{ ...styles.tableCell, flex: 2 }}>
                      {empName}
                    </Text>
                    <Text
                      style={{
                        ...getStatutStyle(presence.statut),
                        flex: 1,
                      }}
                    >
                      {presence.statut}
                    </Text>
                    <Text
                      style={{
                        ...styles.tableCell,
                        flex: 1,
                        ...styles.tableCellNumeric,
                      }}
                    >
                      {presence.heures_travaillees ? `${presence.heures_travaillees}h` : '-'}
                    </Text>
                    <Text style={{ ...styles.tableCell, flex: 1.5 }}>
                      {presence.justification || '-'}
                    </Text>
                    <Text style={{ ...styles.tableCell, flex: 1 }}>
                      {new Date(presence.date_jour).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        ) : (
          <Text style={styles.emptyMessage}>Aucune présence enregistrée</Text>
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
