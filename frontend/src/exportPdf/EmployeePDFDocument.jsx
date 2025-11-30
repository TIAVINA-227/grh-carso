//frontend/src/exportPdf/EmployeePDFDocument.jsx
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

// Styles ultra-modernes et stylés
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 0,
    fontFamily: 'Helvetica',
  },
  
  // ===== HEADER MODERNE AVEC GRADIENT SIMULATION =====
  headerSection: {
    backgroundColor: '#0F172A', // Fond sombre moderne
    padding: 40,
    paddingTop: 35,
    paddingBottom: 35,
    position: 'relative',
  },
  
  // Ligne d'accent gradient simulée
  headerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#3B82F6', // Bleu moderne
  },
  
  headerContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  headerLeft: {
    flex: 1,
  },
  
  // Logo en haut à droite
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  
  logoPlaceholder: {
    fontSize: 32,
    color: '#3B82F6',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  
  subtitle: {
    fontSize: 13,
    color: '#94A3B8', // Gris clair
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  
  dateTimeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  
  dateTimeBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  
  dateTimeText: {
    fontSize: 9,
    color: '#CBD5E1',
    letterSpacing: 0.5,
  },
  
  // ===== SECTION STATISTIQUES MODERNE (CARDS) =====
  statsSection: {
    padding: 40,
    paddingTop: 35,
    paddingBottom: 35,
    backgroundColor: '#F8FAFC', // Fond légèrement gris
  },
  
  statsGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  
  statCardBlue: {
    borderLeftColor: '#3B82F6',
  },
  
  statCardPurple: {
    borderLeftColor: '#8B5CF6',
  },
  
  statCardEmerald: {
    borderLeftColor: '#10B981',
  },
  
  statLabel: {
    fontSize: 9,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: -1,
  },
  
  statDescription: {
    fontSize: 8,
    color: '#94A3B8',
    marginTop: 4,
  },
  
  // ===== TABLE MODERNE =====
  tableSection: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  
  tableTitleContainer: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  
  tableCount: {
    fontSize: 11,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  
  tableContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
  },
  
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  
  tableRowHover: {
    backgroundColor: '#FAFBFC',
  },
  
  tableCell: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.4,
  },
  
  tableCellBold: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  
  // Badge matricule moderne
  matriculeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    display: 'inline-block',
  },
  
  matriculeText: {
    fontSize: 8,
    color: '#3B82F6',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: 'Courier',
  },
  
  // Status badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#D1FAE5',
  },
  
  statusText: {
    fontSize: 7,
    color: '#059669',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // ===== FOOTER MODERNE =====
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8FAFC',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  
  footerContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  footerLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  
  footerDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#CBD5E1',
  },
  
  footerText: {
    fontSize: 8,
    color: '#64748B',
    letterSpacing: 0.3,
  },
  
  confidentialBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  
  confidentialText: {
    fontSize: 7,
    color: '#D97706',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  pageNumber: {
    fontSize: 8,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  
  // ===== MESSAGE VIDE MODERNE =====
  emptyContainer: {
    textAlign: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  
  emptyIcon: {
    fontSize: 48,
    color: '#CBD5E1',
    marginBottom: 16,
  },
  
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 8,
  },
  
  emptyMessage: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 1.6,
  },
  
  // ===== DECORATIONS =====
  decorativeCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1E293B',
    opacity: 0.5,
    top: -100,
    right: -100,
  },
})

export default function EmployeePDFDocument({ employees, logoUrl }) {
  const now = new Date()
  const dateFormatted = now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const timeFormatted = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const formatMatricule = (id) => {
    return `EMP-${String(id).padStart(4, '0')}`
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
        {/* ===== HEADER MODERNE AVEC LOGO EN HAUT À DROITE ===== */}
        <View style={styles.headerSection}>
          {/* Ligne d'accent bleue */}
          <View style={styles.headerAccent} />
          
          {/* Cercle décoratif */}
          <View style={styles.decorativeCircle} />
          
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.mainTitle}>Répertoire des Employés</Text>
              <Text style={styles.subtitle}>Rapport Ressources Humaines</Text>
              
              {/* Date et heure en badges */}
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeBadge}>
                  <Text style={styles.dateTimeText}>📅 {dateFormatted}</Text>
                </View>
                <View style={styles.dateTimeBadge}>
                  <Text style={styles.dateTimeText}>🕐 {timeFormatted}</Text>
                </View>
              </View>
            </View>
            
            {/* Logo en haut à droite */}
            <View style={styles.logoContainer}>
              {logoUrl ? (
                <Image src={logoUrl} style={styles.logoImage} />
              ) : (
                <Text style={styles.logoPlaceholder}>C</Text>
              )}
            </View>
          </View>
        </View>

        {/* ===== SECTION STATISTIQUES MODERNE (CARDS) ===== */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {/* Card Employés */}
            <View style={[styles.statCard, styles.statCardBlue]}>
              <Text style={styles.statLabel}>Total Employés</Text>
              <Text style={styles.statValue}>{totalEmployees}</Text>
              <Text style={styles.statDescription}>Personnel actif</Text>
            </View>
            
            {/* Card Départements */}
            <View style={[styles.statCard, styles.statCardPurple]}>
              <Text style={styles.statLabel}>Départements</Text>
              <Text style={styles.statValue}>{totalDepartments}</Text>
              <Text style={styles.statDescription}>Services actifs</Text>
            </View>
            
            {/* Card Postes */}
            <View style={[styles.statCard, styles.statCardEmerald]}>
              <Text style={styles.statLabel}>Postes</Text>
              <Text style={styles.statValue}>{totalPostes}</Text>
              <Text style={styles.statDescription}>Fonctions uniques</Text>
            </View>
          </View>
        </View>

        {/* ===== TABLE MODERNE ===== */}
        <View style={styles.tableSection}>
          <View style={styles.tableTitleContainer}>
            <Text style={styles.tableTitle}>Liste des employés</Text>
            <Text style={styles.tableCount}>{totalEmployees} employé{totalEmployees > 1 ? 's' : ''}</Text>
          </View>
          
          {employees && employees.length > 0 ? (
            <View style={styles.tableContainer}>
              {/* Header */}
              <View style={styles.tableHeader}>
                <Text style={{ ...styles.tableHeaderCell, flex: 0.8 }}>Matricule</Text>
                <Text style={{ ...styles.tableHeaderCell, flex: 1.5 }}>Nom Complet</Text>
                <Text style={{ ...styles.tableHeaderCell, flex: 1.2 }}>Poste</Text>
                <Text style={{ ...styles.tableHeaderCell, flex: 1.1 }}>Département</Text>
                <Text style={{ ...styles.tableHeaderCell, flex: 1.4 }}>Email</Text>
                <Text style={{ ...styles.tableHeaderCell, flex: 0.9 }}>Téléphone</Text>
              </View>

              {/* Rows */}
              {employees.map((employee, index) => (
                <View
                  key={employee.id}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowHover : {},
                  ]}
                >
                  {/* Matricule avec badge */}
                  <View style={{ flex: 0.8 }}>
                    <View style={styles.matriculeBadge}>
                      <Text style={styles.matriculeText}>
                        {formatMatricule(employee.id)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={{ ...styles.tableCell, ...styles.tableCellBold, flex: 1.5 }}>
                    {`${employee.nom || ''} ${employee.prenom || ''}`.trim()}
                  </Text>
                  
                  <Text style={{ ...styles.tableCell, flex: 1.2 }}>
                    {employee.poste?.intitule || 'Non assigné'}
                  </Text>
                  
                  <Text style={{ ...styles.tableCell, flex: 1.1 }}>
                    {employee.departement?.nom_departement || 'Non assigné'}
                  </Text>
                  
                  <Text style={{ ...styles.tableCell, flex: 1.4 }}>
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
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Aucun employé trouvé</Text>
              <Text style={styles.emptyMessage}>
                La liste des employés est actuellement vide.{'\n'}
                Ajoutez des employés pour les voir apparaître ici.
              </Text>
            </View>
          )}
        </View>

        {/* ===== FOOTER MODERNE ===== */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerText}>Carso RH Manager</Text>
              <View style={styles.footerDivider} />
              <Text style={styles.footerText}>v2.0</Text>
              <View style={styles.footerDivider} />
              <View style={styles.confidentialBadge}>
                <Text style={styles.confidentialText}>🔒 Confidentiel</Text>
              </View>
            </View>
            
            <Text style={styles.pageNumber}>Page 1 / 1</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}