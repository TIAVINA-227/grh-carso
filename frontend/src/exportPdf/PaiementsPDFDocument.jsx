// frontend/src/exportPdf/PaiementsPDFDocument.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import logocarso from '../assets/carso 1.png';

// --- Configuration et Couleurs ---

// Définition de la palette de couleurs (Bleu plus profond pour l'autorité)
const COLORS = {
  primary: '#004A8F', // Bleu d'entreprise, plus sombre et professionnel
  secondary: '#6699CC', // Bleu clair pour l'accentuation
  text: '#222222', // Texte très sombre
  background: '#F4F7FB', // Gris/Bleu très léger pour l'alternance de lignes
  border: '#AAAAAA',
};

// --- Styles du Document ---
const styles = StyleSheet.create({
  // --- Page Styles ---
  page: {
    backgroundColor: 'white',
    fontSize: 10,
    paddingTop: 40, 
    paddingBottom: 50, 
    paddingHorizontal: 40,
    color: COLORS.text,
  },

  // --- En-tête de page (Positionné en haut, fixe) ---
  headerContainer: {
    position: 'absolute',
    top: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: `3pt solid ${COLORS.primary}`, 
    paddingBottom: 10,
    marginBottom: 20,
  },
  
  logo: {
    width: 80, 
    height: 80, 
    objectFit: 'contain', 
  },

  companyInfo: {
    fontSize: 9,
    color: COLORS.text,
    width: '60%',
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },

  // --- Titre du Rapport ---
  reportTitle: {
    fontSize: 20,
    marginTop: 100, 
    marginBottom: 5,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 10,
    marginBottom: 20,
    color: COLORS.text,
  },
  
  // --- Table Styles ---
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '20%',
    padding: 8,
    backgroundColor: COLORS.primary,
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
    borderRight: `1pt solid ${COLORS.secondary}`, 
  },
  tableCol: {
    width: '20%',
    padding: 8,
    fontSize: 9,
    borderBottom: `1pt solid ${COLORS.border}`,
    borderRight: `1pt solid ${COLORS.border}`,
  },
  tableRowOdd: {
    backgroundColor: COLORS.background, 
  },

  // --- Total Style ---
  totalRow: {
    backgroundColor: COLORS.secondary,
    borderTop: `2pt solid ${COLORS.primary}`,
    color: 'white',
  },
  totalCell: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // --- Footer Styles ---
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
    borderTop: `1pt solid ${COLORS.border}`,
    paddingTop: 5,
  }
});

export default function PaiementsPDFDocument({ paiements = [], employes = [], logocarso = null, companyName = "Nom de l'Entreprise SA", companyAddress = "123 Rue de la Grande Société, 75000 Ville" }) {
  const getEmployeName = (id) => {
    const e = employes.find(x => x.id === id);
    return e ? `${e.nom} ${e.prenom}` : `#${id}`;
  };

  const formatCurrency = (amount) => {
    return amount ? `${parseFloat(amount).toFixed(2)} €` : 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.slice(0, 10).split('-').reverse().join('/'); 
  };
  
  // Calcul du total
  const totalMontant = paiements.reduce((sum, p) => sum + (p.montant || 0), 0);

  return (
    <Document>
      <Page style={styles.page} size="A4">
        
        {/* En-tête de Document (avec Logo et Infos Entreprise) */}
        <View style={styles.headerContainer} fixed>
          {/* Infos Entreprise (Gauche) */}
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{companyName}</Text>
            <Text>{companyAddress}</Text>
            <Text>Tél: +1 234 567 890 | Email: contact@entreprise.com</Text>
          </View>

          {/* Emplacement du Logo (Droite) */}
          <View style={{ width: '40%', alignItems: 'flex-end' }}>
            {logocarso ? (
              <Image style={styles.logo} src={logocarso} />
            ) : (
              <View style={[styles.logo, { backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 8, color: '#666' }}>[ Emplacement Logo ]</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Titre du Rapport */}
        <Text style={styles.reportTitle}>Rapport Détaillé des Paiements</Text>
        <Text style={styles.subheader}>Période: Du {paiements[0] ? formatDate(paiements[0].periode_debut) : 'N/A'} au {paiements[0] ? formatDate(paiements[paiements.length - 1].periode_fin) : 'N/A'} | Généré le : {formatDate(new Date().toISOString())}</Text>

        {/* Tableau des Données */}
        <View style={styles.table}>
          
          {/* En-têtes du Tableau */}
          <View style={styles.tableRow} fixed>
            <Text style={{...styles.tableColHeader, borderTopLeftRadius: 3}}>Employé</Text>
            <Text style={styles.tableColHeader}>Montant</Text>
            <Text style={styles.tableColHeader}>Mode Paiement</Text>
            <Text style={styles.tableColHeader}>Début Période</Text>
            <Text style={{...styles.tableColHeader, borderTopRightRadius: 3, borderRight: 'none'}}>Fin Période</Text>
          </View>

          {/* Lignes de Données */}
          {paiements.map((p, idx) => {
            const rowStyle = idx % 2 === 1 ? styles.tableRowOdd : {};
            return (
              <View style={[styles.tableRow, rowStyle]} key={idx}>
                <Text style={styles.tableCol}>{getEmployeName(p.employeId)}</Text>
                <Text style={styles.tableCol}>{formatCurrency(p.montant)}</Text>
                <Text style={styles.tableCol}>{p.mode_paiement}</Text>
                <Text style={styles.tableCol}>{formatDate(p.periode_debut)}</Text>
                <Text style={{...styles.tableCol, borderRight: 'none'}}>{formatDate(p.periode_fin)}</Text>
              </View>
            );
          })}
          
          {/* Ligne de Total Général */}
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={{ ...styles.totalCell, width: '40%', textAlign: 'right' }}>
              TOTAL GÉNÉRAL DES PAIEMENTS:
            </Text>
            <Text style={{ ...styles.totalCell, width: '20%', borderRight: `1pt solid white` }}>
              {formatCurrency(totalMontant)}
            </Text>
            <Text style={{ ...styles.totalCell, width: '40%' }}>
              {/* Espacement */}
            </Text>
          </View>
        </View>

        {/* Pied de Page */}
        <Text 
          style={styles.footer} 
          render={({ pageNumber, totalPages }) => (
            `Document généré pour ${companyName} | Page ${pageNumber} sur ${totalPages}`
          )} 
          fixed 
        />
        
      </Page>
    </Document>
  );
}