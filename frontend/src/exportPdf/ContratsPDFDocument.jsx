import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: '#F8FAFC',
  },
  // Header avec gradient simulé
  headerContainer: {
    backgroundColor: '#1E40AF',
    padding: 30,
    paddingBottom: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    color: '#BFDBFE',
    marginTop: 4,
  },
  // Section info moderne
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 30,
    marginTop: -20,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoCard: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 11,
    color: '#0F172A',
    fontWeight: 'bold',
  },
  // Tableau stylé
  tableContainer: {
    margin: 30,
    marginTop: 20,
  },
  table: {
    display: 'table',
    width: 'auto',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderBottomStyle: 'solid',
    minHeight: 36,
    alignItems: 'center',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    minHeight: 40,
    alignItems: 'center',
  },
  tableCol: {
    padding: 8,
    paddingLeft: 12,
    fontSize: 8.5,
    color: '#334155',
  },
  tableColHeader: {
    padding: 8,
    paddingLeft: 12,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Colonnes avec largeurs adaptées
  colEmploye: {
    width: '22%',
  },
  colType: {
    width: '13%',
  },
  colDateDebut: {
    width: '15%',
  },
  colDateFin: {
    width: '15%',
  },
  colPoste: {
    width: '20%',
  },
  colStatut: {
    width: '15%',
  },
  alternateRow: {
    backgroundColor: '#F8FAFC',
  },
  // Badge pour statut
  statusBadge: {
    padding: 4,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusActif: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
  },
  statusTermine: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    padding: 40,
    fontSize: 12,
    color: '#6b7280',
  },
})

const getStatutStyle = (statut) => {
  switch (statut) {
    case 'ACTIF':
      return { ...styles.statusBadge, ...styles.statusActif }
    case 'TERMINE':
      return { ...styles.statusBadge, ...styles.statusTermine }
    default:
      return styles.statusBadge
  }
}

export default function ContratsPDFDocument({ contrats, employes, logoUrl }) {
  const dateActuelle = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const dateFormatee = dateActuelle.toLocaleDateString('fr-FR', options)
  const dateFinale = dateFormatee.charAt(0).toUpperCase() + dateFormatee.slice(1)

  const contratsActifs = contrats?.filter(c => c.statut === 'ACTIF').length || 0
  const contratsCDI = contrats?.filter(c => c.type_contrat === 'CDI').length || 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header moderne avec logo à droite */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Liste des Contrats</Text>
              <Text style={styles.subtitle}>Rapport de gestion des contrats de travail</Text>
            </View>
            {logoUrl && <Image src={logoUrl} style={styles.logo} />}
          </View>
        </View>

        {/* Section info avec cards modernes */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Date d'édition</Text>
            <Text style={styles.infoValue}>{dateFinale}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Total Contrats</Text>
            <Text style={styles.infoValue}>{contrats?.length || 0} contrat{(contrats?.length || 0) > 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Actifs</Text>
            <Text style={styles.infoValue}>{contratsActifs}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>CDI</Text>
            <Text style={styles.infoValue}>{contratsCDI}</Text>
          </View>
        </View>

        {/* Tableau stylé */}
        {contrats && contrats.length > 0 ? (
          <View style={styles.tableContainer}>
            <View style={styles.table}>
              {/* Header du tableau */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableColHeader, styles.colEmploye]}>Employé</Text>
                <Text style={[styles.tableColHeader, styles.colType]}>Type</Text>
                <Text style={[styles.tableColHeader, styles.colDateDebut]}>Date Début</Text>
                <Text style={[styles.tableColHeader, styles.colDateFin]}>Date Fin</Text>
                <Text style={[styles.tableColHeader, styles.colPoste]}>Poste</Text>
                <Text style={[styles.tableColHeader, styles.colStatut]}>Statut</Text>
              </View>

              {/* Lignes du tableau */}
              {contrats.map((contrat, index) => {
                const emp = employes?.find((e) => e.id === contrat.employeId)
                const empName = emp
                  ? `${emp.nom || ''} ${emp.prenom || ''}`.trim()
                  : `Employé #${contrat.employeId}`
                
                // Récupérer le poste de l'employé
                const posteIntitule = emp?.poste?.intitule || 'Non assigné'

                const dateDebut = contrat.date_debut
                  ? new Date(contrat.date_debut).toLocaleDateString('fr-FR')
                  : '-'
                const dateFin = contrat.date_fin
                  ? new Date(contrat.date_fin).toLocaleDateString('fr-FR')
                  : 'Indéterminée'

                return (
                  <View
                    key={contrat.id}
                    style={[styles.tableRow, index % 2 === 1 && styles.alternateRow]}
                  >
                    <Text style={[styles.tableCol, styles.colEmploye]}>
                      {empName}
                    </Text>
                    <Text style={[styles.tableCol, styles.colType]}>
                      {contrat.type_contrat || '-'}
                    </Text>
                    <Text style={[styles.tableCol, styles.colDateDebut]}>
                      {dateDebut}
                    </Text>
                    <Text style={[styles.tableCol, styles.colDateFin]}>
                      {dateFin}
                    </Text>
                    <Text style={[styles.tableCol, styles.colPoste]}>
                      {posteIntitule}
                    </Text>
                    <View style={[styles.tableCol, styles.colStatut]}>
                      <Text style={getStatutStyle(contrat.statut)}>
                        {contrat.statut || '-'}
                      </Text>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
        ) : (
          <Text style={styles.emptyMessage}>Aucun contrat enregistré</Text>
        )}

        {/* Footer moderne */}
        <Text style={styles.footer}>
          Document généré automatiquement le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Page>
    </Document>
  )
}