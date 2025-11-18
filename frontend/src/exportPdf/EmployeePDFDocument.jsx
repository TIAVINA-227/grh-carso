
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
    fontSize: 10,
    color: '#1f2937',
  },
  tableCellHeader: {
    flex: 1,
    padding: 10,
    fontSize: 10,
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
})

export default function EmployeePDFDocument({ employees, logoUrl }) {
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

  const formatMatricule = (id) => {
    return `EMP${String(id).padStart(3, '0')}`
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
            <Text style={styles.mainTitle}>Liste des Employés</Text>
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
            <Text style={styles.infoValue}>{employees.length} employé(s)</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Heure</Text>
            <Text style={styles.infoValue}>{timeFormatted}</Text>
          </View>
        </View>

        {/* Table */}
        {employees && employees.length > 0 ? (
          <View style={styles.tableContainer}>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={{ ...styles.tableCellHeader, flex: 0.8 }}>Matricule</Text>
                <Text style={{ ...styles.tableCellHeader, flex: 1.5 }}>Nom Complet</Text>
                <Text style={{ ...styles.tableCellHeader, flex: 1.5 }}>Poste</Text>
                <Text style={{ ...styles.tableCellHeader, flex: 1.3 }}>Département</Text>
                <Text style={{ ...styles.tableCellHeader, flex: 1.2 }}>Email</Text>
                <Text style={{ ...styles.tableCellHeader, flex: 1 }}>Téléphone</Text>
              </View>

              {/* Table Body */}
              {employees.map((employee, index) => (
                <View
                  key={employee.id}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowEven : {},
                  ]}
                >
                  <Text style={{ ...styles.tableCell, flex: 0.8 }}>
                    {formatMatricule(employee.id)}
                  </Text>
                  <Text style={{ ...styles.tableCell, flex: 1.5 }}>
                    {`${employee.nom || ''} ${employee.prenom || ''}`.trim()}
                  </Text>
                  <Text style={{ ...styles.tableCell, flex: 1.5 }}>
                    {employee.poste?.intitule || 'Non assigné'}
                  </Text>
                  <Text style={{ ...styles.tableCell, flex: 1.3 }}>
                    {employee.departement?.nom_departement || 'Non assigné'}
                  </Text>
                  <Text style={{ ...styles.tableCell, flex: 1.2 }}>
                    {employee.email || '-'}
                  </Text>
                  <Text style={{ ...styles.tableCell, flex: 1 }}>
                    {employee.telephone || '-'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.emptyMessage}>Aucun employé à afficher</Text>
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