import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

// Styles ultra-professionnels pour dirigeants d'entreprise
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 50,
    fontFamily: 'Helvetica',
  },
  // Header exécutif minimaliste
  header: {
    marginBottom: 35,
    paddingBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  logoContainer: {
    width: 90,
    height: 90,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  logoPlaceholder: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
    letterSpacing: -0.3,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 11,
    color: '#666666',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  // Section statistiques épurée (en ligne)
  statsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  statItem: {
    flex: 1,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 26,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e5e5',
    marginHorizontal: 20,
  },
  // Table corporate élégante
  tableContainer: {
    marginBottom: 30,
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tableRowEven: {
    backgroundColor: '#fafafa',
  },
  tableCell: {
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.5,
  },
  tableCellBold: {
    fontWeight: 'bold',
    color: '#000000',
  },
  // Matricule épuré
  matriculeText: {
    fontSize: 9,
    color: '#666666',
    fontFamily: 'Courier',
    letterSpacing: 0.5,
  },
  // Footer exécutif
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#999999',
    letterSpacing: 0.3,
  },
  footerBrand: {
    fontSize: 8,
    color: '#666666',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  pageNumber: {
    fontSize: 8,
    color: '#999999',
  },
  // Message vide élégant
  emptyContainer: {
    textAlign: 'center',
    padding: 80,
  },
  emptyMessage: {
    fontSize: 11,
    color: '#666666',
    letterSpacing: 0.5,
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

  // Calcul de statistiques
  const totalEmployees = employees.length
  const departmentsSet = new Set(employees.map(e => e.departement?.nom_departement).filter(Boolean))
  const totalDepartments = departmentsSet.size
  const postesSet = new Set(employees.map(e => e.poste?.intitule).filter(Boolean))
  const totalPostes = postesSet.size

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header exécutif */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.mainTitle}>Répertoire des Employés</Text>
            <Text style={styles.subtitle}>
              Rapport Confidentiel • Ressources Humaines
            </Text>
          </View>
          
          {/* Logo corporate */}
          <View style={styles.logoContainer}>
            {logoUrl ? (
              <Image src={logoUrl} style={styles.logoImage} />
            ) : (
              <Text style={styles.logoPlaceholder}>LOGO</Text>
            )}
          </View>
        </View>

        {/* Statistiques épurées */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalEmployees}</Text>
            <Text style={styles.statLabel}>Employés</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalDepartments}</Text>
            <Text style={styles.statLabel}>Départements</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalPostes}</Text>
            <Text style={styles.statLabel}>Postes</Text>
          </View>
        </View>

        {/* Table corporate */}
        {employees && employees.length > 0 ? (
          <View style={styles.tableContainer}>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={{ ...styles.tableHeaderCell, flex: 0.7 }}>Matricule</Text>
              <Text style={{ ...styles.tableHeaderCell, flex: 1.5 }}>Nom Complet</Text>
              <Text style={{ ...styles.tableHeaderCell, flex: 1.3 }}>Poste</Text>
              <Text style={{ ...styles.tableHeaderCell, flex: 1.2 }}>Département</Text>
              <Text style={{ ...styles.tableHeaderCell, flex: 1.5 }}>Email</Text>
              <Text style={{ ...styles.tableHeaderCell, flex: 0.9 }}>Téléphone</Text>
            </View>

            {/* Rows */}
            {employees.map((employee, index) => (
              <View
                key={employee.id}
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.tableRowEven : {},
                ]}
              >
                <Text style={{ ...styles.matriculeText, flex: 0.7 }}>
                  {formatMatricule(employee.id)}
                </Text>
                <Text style={{ ...styles.tableCell, ...styles.tableCellBold, flex: 1.5 }}>
                  {`${employee.nom || ''} ${employee.prenom || ''}`.trim()}
                </Text>
                <Text style={{ ...styles.tableCell, flex: 1.3 }}>
                  {employee.poste?.intitule || 'Non assigné'}
                </Text>
                <Text style={{ ...styles.tableCell, flex: 1.2 }}>
                  {employee.departement?.nom_departement || 'Non assigné'}
                </Text>
                <Text style={{ ...styles.tableCell, flex: 1.5 }}>
                  {employee.email || '—'}
                </Text>
                <Text style={{ ...styles.tableCell, flex: 0.9 }}>
                  {employee.telephone || '—'}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyMessage}>
              Aucune donnée disponible
            </Text>
          </View>
        )}

        {/* Footer exécutif */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerText}>
              {dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)} • {timeFormatted}
            </Text>
          </View>
          <Text style={styles.pageNumber}>
            Page 1 sur 1
          </Text>
          <Text style={styles.footerBrand}>
            Confidentiel
          </Text>
        </View>
      </Page>
    </Document>
  )
}