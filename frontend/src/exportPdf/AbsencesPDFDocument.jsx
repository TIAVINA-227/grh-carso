// import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

// // Styles pour le PDF
// const styles = StyleSheet.create({
//   document: {
//     padding: 20,
//   },
//   header: {
//     marginBottom: 20,
//     borderBottom: 1,
//     borderBottomColor: '#e5e7eb',
//     paddingBottom: 15,
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   logoContainer: {
//     width: 60,
//     height: 60,
//     marginRight: 15,
//   },
//   logoImage: {
//     width: '100%',
//     height: '100%',
//   },
//   titleSection: {
//     flex: 1,
//   },
//   mainTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 11,
//     color: '#6b7280',
//   },
//   infoSection: {
//     marginBottom: 20,
//     display: 'flex',
//     flexDirection: 'row',
//     gap: 40,
//     flexWrap: 'wrap',
//   },
//   infoItem: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   infoLabel: {
//     fontSize: 9,
//     color: '#9ca3af',
//     fontWeight: 'bold',
//     marginBottom: 4,
//     textTransform: 'uppercase',
//   },
//   infoValue: {
//     fontSize: 11,
//     color: '#1f2937',
//     fontWeight: '500',
//   },
//   tableContainer: {
//     marginBottom: 20,
//   },
//   table: {
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderStyle: 'solid',
//   },
//   tableHeader: {
//     display: 'flex',
//     flexDirection: 'row',
//     backgroundColor: '#2563eb',
//     color: '#ffffff',
//   },
//   tableRow: {
//     display: 'flex',
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   tableRowEven: {
//     backgroundColor: '#f9fafb',
//   },
//   tableCell: {
//     flex: 1,
//     padding: 8,
//     fontSize: 9,
//     color: '#1f2937',
//   },
//   tableCellHeader: {
//     flex: 1,
//     padding: 10,
//     fontSize: 9,
//     fontWeight: 'bold',
//     color: '#ffffff',
//   },
//   footer: {
//     marginTop: 20,
//     paddingTop: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//     textAlign: 'center',
//     fontSize: 9,
//     color: '#6b7280',
//   },
//   emptyMessage: {
//     textAlign: 'center',
//     padding: 20,
//     fontSize: 12,
//     color: '#6b7280',
//   },
//   statusBadge: {
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//     fontSize: 8,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   statusApprouvee: {
//     backgroundColor: '#d1fae5',
//     color: '#065f46',
//   },
//   statusRejetee: {
//     backgroundColor: '#fee2e2',
//     color: '#7f1d1d',
//   },
//   statusEnCours: {
//     backgroundColor: '#fef3c7',
//     color: '#92400e',
//   },
// })

// const getStatutStyle = (statut) => {
//   switch (statut) {
//     case 'APPROUVEE':
//       return { ...styles.statusBadge, ...styles.statusApprouvee }
//     case 'REJETEE':
//       return { ...styles.statusBadge, ...styles.statusRejetee }
//     case 'EN_COURS':
//       return { ...styles.statusBadge, ...styles.statusEnCours }
//     default:
//       return styles.statusBadge
//   }
// }

// export default function AbsencesPDFDocument({ absences, employes, logoUrl }) {
//   const now = new Date()
//   const dateFormatted = now.toLocaleDateString('fr-FR', {
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   })
//   const timeFormatted = now.toLocaleTimeString('fr-FR', {
//     hour: '2-digit',
//     minute: '2-digit',
//   })

//   return (
//     <Document>
//       <Page size="A4" style={styles.document}>
//         {/* Header */}
//         <View style={styles.header}>
//           {logoUrl && (
//             <View style={styles.logoContainer}>
//               <Image src={logoUrl} style={styles.logoImage} />
//             </View>
//           )}
//           <View style={styles.titleSection}>
//             <Text style={styles.mainTitle}>Liste des Absences</Text>
//             <Text style={styles.subtitle}>
//               Document généré automatiquement
//             </Text>
//           </View>
//         </View>

//         {/* Info Section */}
//         <View style={styles.infoSection}>
//           <View style={styles.infoItem}>
//             <Text style={styles.infoLabel}>Date</Text>
//             <Text style={styles.infoValue}>{dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)}</Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Text style={styles.infoLabel}>Total</Text>
//             <Text style={styles.infoValue}>{absences?.length || 0} absence(s)</Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Text style={styles.infoLabel}>Heure génération</Text>
//             <Text style={styles.infoValue}>{timeFormatted}</Text>
//           </View>
//         </View>

//         {/* Table */}
//         {absences && absences.length > 0 ? (
//           <View style={styles.tableContainer}>
//             <View style={styles.table}>
//               {/* Table Header */}
//               <View style={styles.tableHeader}>
//                 <Text style={{ ...styles.tableCellHeader, flex: 0.8 }}>
//                   Employé
//                 </Text>
//                 <Text style={{ ...styles.tableCellHeader, flex: 1.2 }}>
//                   Date Début
//                 </Text>
//                 <Text style={{ ...styles.tableCellHeader, flex: 1.2 }}>
//                   Date Fin
//                 </Text>
//                 <Text style={{ ...styles.tableCellHeader, flex: 1 }}>
//                   Motif
//                 </Text>
//                 <Text style={{ ...styles.tableCellHeader, flex: 1 }}>
//                   Statut
//                 </Text>
//               </View>

//               {/* Table Body */}
//               {absences.map((absence, index) => {
//                 const emp = employes?.find((e) => e.id === absence.employeId)
//                 const empName = emp
//                   ? `${emp.nom} ${emp.prenom}`
//                   : `Employé #${absence.employeId}`

//                 const dateDebut = new Date(absence.date_debut).toLocaleDateString('fr-FR')
//                 const dateFin = new Date(absence.date_fin).toLocaleDateString('fr-FR')

//                 return (
//                   <View
//                     key={absence.id}
//                     style={[
//                       styles.tableRow,
//                       index % 2 === 0 ? styles.tableRowEven : {},
//                     ]}
//                   >
//                     <Text style={{ ...styles.tableCell, flex: 0.8 }}>
//                       {empName}
//                     </Text>
//                     <Text style={{ ...styles.tableCell, flex: 1.2 }}>
//                       {dateDebut}
//                     </Text>
//                     <Text style={{ ...styles.tableCell, flex: 1.2 }}>
//                       {dateFin}
//                     </Text>
//                     <Text style={{ ...styles.tableCell, flex: 1 }}>
//                       {absence.motif || '-'}
//                     </Text>
//                     <Text
//                       style={{
//                         ...getStatutStyle(absence.statut),
//                         flex: 1,
//                       }}
//                     >
//                       {absence.statut}
//                     </Text>
//                   </View>
//                 )
//               })}
//             </View>
//           </View>
//         ) : (
//           <Text style={styles.emptyMessage}>Aucune absence enregistrée</Text>
//         )}

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text>
//             Document généré le {dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)} à {timeFormatted}
//           </Text>
//         </View>
//       </Page>
//     </Document>
//   )
// }
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import carso3 from '@/assets/carso 3.png'
import { PRIMARY, PRIMARY_DARK, PAGE_BG, TABLE_BG, TABLE_HEADER_TOP, TABLE_HEADER_BOTTOM, PAGE_PADDING, PAGE_EDGE_GAP, LOGO_SIZE } from './pdfTheme'

const styles = StyleSheet.create({
  document: {
    padding: PAGE_PADDING,
    fontFamily: 'Helvetica',
    backgroundColor: PAGE_BG,
    position: 'relative',
  },
  pageContent: {
    marginLeft: 0,
    paddingLeft: PAGE_PADDING,
    paddingRight: PAGE_PADDING,
    paddingBottom: 72,
  },
  pageLogo: {
    position: 'absolute',
    right: PAGE_EDGE_GAP,
    top: 8,
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffffff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  header: {
    marginBottom: 10,
    paddingBottom: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    justifyContent: 'space-between',
    paddingRight: PAGE_EDGE_GAP + LOGO_SIZE + 8,
  },
  logoContainer: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: TABLE_BG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  titleSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#475569',
  },
  infoSection: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    minWidth: 120,
    paddingVertical: 10,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 8,
    color: PRIMARY_DARK,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 12,
    color: '#0b1220',
    fontWeight: '800',
  },
  tableContainer: {
    marginBottom: 26,
    paddingHorizontal: 0,
    marginLeft: PAGE_EDGE_GAP - PAGE_PADDING,
    marginRight: PAGE_EDGE_GAP - PAGE_PADDING,
    backgroundColor: TABLE_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tableHeaderCell: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'left',
  },
  tableHeaderCellWrapper: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tableHeaderCellTop: {
    height: 7,
    width: '100%',
    backgroundColor: TABLE_HEADER_TOP,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  tableRowEven: {
    backgroundColor: PAGE_BG,
  },
  tableCell: {
    paddingRight: 12,
    paddingLeft: 12,
    paddingVertical: 6,
    fontSize: 11,
    color: '#0b1220',
    textAlign: 'left',
  },

  /* ---------------------- FOOTER FULL WIDTH ---------------------- */
  pageFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    color: PRIMARY_DARK,
    fontWeight: '700',
  },

  /* --------------------------------------------------------------- */

  emptyMessage: {
    textAlign: 'center',
    padding: 20,
    fontSize: 12,
    color: '#6b7280',
  },
})

const formatTypeAbsence = (type) => {
  if (!type) return '-'
  if (typeof type === 'object') {
    return type.label || type.nom || type.name || '-'
  }
  switch (String(type)) {
    case 'MALADIE':
      return 'Maladie'
    case 'RDV':
      return 'Rendez-vous'
    case 'PERSONNELLE':
      return "Absence personnelle"
    case 'FORMATION':
      return 'Formation'
    default:
      return String(type).toLowerCase().replace(/_/g, ' ').replace(/(^|\s)\S/g, (t) => t.toUpperCase())
  }
}

export default function AbsencesPDFDocument({ absences, employes, logoUrl }) {
  const defaultCompany = {
    name: 'GRH Carso',
    address: '[Votre adresse ici]',
    phone: '[00 00 00 00 00]',
    email: 'contact@carso.local',
    site: 'https://carso.example',
    logoUrl: carso3,
  }
  const company = (arguments[0] && arguments[0].company) ? { ...defaultCompany, ...arguments[0].company } : defaultCompany
  const displayLogo = logoUrl || company.logoUrl || defaultCompany.logoUrl

  const now = new Date()
  const dateFormatted = now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const timeFormatted = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const totalAbsences = absences?.length || 0

  return (
    <Document>
      <Page size="A4" style={styles.document}>
        <View style={styles.pageContent}>
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>Liste des Absences</Text>
              <Text style={{ fontSize: 8, color: '#1f2937', fontWeight: '600', opacity: 0.85 }}>
                Export créé automatiquement · {company.name}
              </Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: '#f1f5f9', marginTop: 12, marginBottom: 12 }} />

          {displayLogo && (
            <View style={styles.pageLogo}>
              <Image src={displayLogo} style={styles.logoImage} />
            </View>
          )}

          

          {absences && absences.length > 0 ? (
            <View style={styles.tableContainer}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <View style={{ ...styles.tableHeaderCellWrapper, flex: 1.6, borderTopLeftRadius: 12 }}>
                    <View style={styles.tableHeaderCellTop} />
                    <Text style={styles.tableHeaderCell}>Employé</Text>
                  </View>
                  <View style={{ ...styles.tableHeaderCellWrapper, flex: 1.4 }}>
                    <View style={styles.tableHeaderCellTop} />
                    <Text style={styles.tableHeaderCell}>Motif / Type</Text>
                  </View>
                  <View style={{ ...styles.tableHeaderCellWrapper, flex: 0.9, alignItems: 'center' }}>
                    <View style={styles.tableHeaderCellTop} />
                    <Text style={{ ...styles.tableHeaderCell, textAlign: 'center' }}>Date Début</Text>
                  </View>
                  <View style={{ ...styles.tableHeaderCellWrapper, flex: 0.9, borderTopRightRadius: 12, alignItems: 'center' }}>
                    <View style={styles.tableHeaderCellTop} />
                    <Text style={{ ...styles.tableHeaderCell, textAlign: 'center' }}>Date Fin</Text>
                  </View>
                </View>

                {absences.map((absence, index) => {
                  const emp = employes?.find((e) => e.id === absence.employeId)
                  const empName = emp ? `${emp.nom} ${emp.prenom}` : `Employé #${absence.employeId}`

                  const dateDebut = new Date(absence.date_debut).toLocaleDateString('fr-FR')
                  const dateFin = new Date(absence.date_fin).toLocaleDateString('fr-FR')

                  const isLast = index === absences.length - 1
                  const rowStyles = [
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowEven : {},
                    isLast
                      ? {
                          borderBottomWidth: 0,
                          borderBottomColor: 'transparent',
                          borderBottomLeftRadius: 10,
                          borderBottomRightRadius: 10,
                        }
                      : {},
                  ]

                  return (
                    <View key={absence.id} style={rowStyles}>
                      <Text style={{ ...styles.tableCell, flex: 1.6 }}>{empName}</Text>
                      <Text style={{ ...styles.tableCell, flex: 1.4 }}>
                        {formatTypeAbsence(absence.type_absence || absence.motif)}
                      </Text>
                      <Text style={{ ...styles.tableCell, flex: 0.9, textAlign: 'center' }}>{dateDebut}</Text>
                      <Text style={{ ...styles.tableCell, flex: 0.9, textAlign: 'center' }}>{dateFin}</Text>
                    </View>
                  )
                })}
              </View>
            </View>
          ) : (
            <Text style={styles.emptyMessage}>Aucune absence enregistrée</Text>
          )}
        </View>

        {/* NEW FULL-WIDTH FOOTER */}
        <View style={styles.pageFooter} fixed>
          <Text style={styles.footerText}>
            {dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)}
          </Text>
          <Text style={styles.footerText}>{totalAbsences} absence(s)</Text>
          <Text style={styles.footerText}>{timeFormatted}</Text>
        </View>
      </Page>
    </Document>
  )
}
