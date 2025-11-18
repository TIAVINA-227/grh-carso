import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { fontSize: 10, padding: 20 },
  header: { fontSize: 14, marginBottom: 8, textAlign: 'center' },
  table: { display: 'table', width: 'auto', marginTop: 8 },
  tableRow: { flexDirection: 'row' },
  tableColHeader: { width: '20%', borderBottom: '1pt solid #ddd', padding: 4, fontSize: 10, fontWeight: 'bold' },
  tableCol: { width: '20%', padding: 4, borderBottom: '1pt solid #eee' },
});

export default function PaiementsPDFDocument({ paiements = [], employes = [] }) {
  const getEmployeName = (id) => {
    const e = employes.find(x => x.id === id);
    return e ? `${e.nom} ${e.prenom}` : `#${id}`;
  };

  return (
    <Document>
      <Page style={styles.page} size="A4">
        <Text style={styles.header}>Liste des paiements</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Employé</Text>
            <Text style={styles.tableColHeader}>Montant</Text>
            <Text style={styles.tableColHeader}>Mode</Text>
            <Text style={styles.tableColHeader}>Période début</Text>
            <Text style={styles.tableColHeader}>Période fin</Text>
          </View>

          {paiements.map((p, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.tableCol}>{getEmployeName(p.employeId)}</Text>
              <Text style={styles.tableCol}>{p.montant?.toString()}</Text>
              <Text style={styles.tableCol}>{p.mode_paiement}</Text>
              <Text style={styles.tableCol}>{p.periode_debut ? p.periode_debut.slice(0,10) : ''}</Text>
              <Text style={styles.tableCol}>{p.periode_fin ? p.periode_fin.slice(0,10) : ''}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
