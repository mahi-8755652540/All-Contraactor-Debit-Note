import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer"
import type { DebitNote } from "@/lib/supabase"

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    backgroundColor: "#ffffff",
    color: "#1e293b",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 16,
  },
  companyName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
  },
  companySubtitle: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  dnBadge: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 4,
    padding: 8,
    alignItems: "flex-end",
  },
  dnTitle: {
    fontSize: 7,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dnNumber: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
    marginTop: 2,
  },
  // Title bar
  titleBar: {
    backgroundColor: "#2563eb",
    padding: 10,
    marginBottom: 20,
    borderRadius: 4,
  },
  titleText: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  // Info grid
  infoGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 12,
  },
  infoBoxTitle: {
    fontSize: 7,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 9,
    color: "#64748b",
    width: 90,
  },
  infoValue: {
    fontSize: 9,
    color: "#1e293b",
    fontFamily: "Helvetica-Bold",
    flex: 1,
  },
  // Financial table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    padding: "8 12",
    borderRadius: 4,
    marginBottom: 4,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    flex: 1,
    textTransform: "uppercase",
  },
  tableHeaderRight: {
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    width: 100,
  },
  tableRow: {
    flexDirection: "row",
    padding: "8 12",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    alignItems: "center",
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  tableCell: {
    fontSize: 9,
    color: "#334155",
    flex: 1,
  },
  tableCellRight: {
    fontSize: 9,
    color: "#334155",
    textAlign: "right",
    width: 100,
    fontFamily: "Helvetica-Bold",
  },
  // Total row
  totalRow: {
    flexDirection: "row",
    padding: "10 12",
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 4,
    marginTop: 4,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    flex: 1,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
    textAlign: "right",
    width: 100,
  },
  // Description
  descBox: {
    marginTop: 16,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 12,
  },
  descTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  descText: {
    fontSize: 9,
    color: "#334155",
    lineHeight: 1.5,
  },
  // Status
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  statusLabel: {
    fontSize: 9,
    color: "#64748b",
  },
  statusBadge: {
    backgroundColor: "#dcfce7",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#166534",
  },
  // Footer
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLeft: {
    fontSize: 8,
    color: "#94a3b8",
  },
  signatureBox: {
    alignItems: "center",
  },
  signatureLine: {
    width: 150,
    borderBottomWidth: 1,
    borderBottomColor: "#94a3b8",
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: "#64748b",
  },
})

// The PDF Document component
const DebitNotePDF = ({ note }: { note: DebitNote & { contractor_name?: string; project_name?: string } }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.companyName}>Shree Spaace Solution</Text>
          <Text style={styles.companySubtitle}>Pvt. Ltd.</Text>
          <Text style={[styles.companySubtitle, { marginTop: 4 }]}>info@shreespaace.com</Text>
        </View>
        <View style={styles.dnBadge}>
          <Text style={styles.dnTitle}>Debit Note No.</Text>
          <Text style={styles.dnNumber}>{note.dn_number}</Text>
          <Text style={[styles.dnTitle, { marginTop: 4 }]}>Date: {note.date_issued}</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Debit Note</Text>
      </View>

      {/* Info Grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Contractor Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Company:</Text>
            <Text style={styles.infoValue}>{note.contractor_name || "—"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Original Invoice:</Text>
            <Text style={styles.infoValue}>{note.original_invoice || "N/A"}</Text>
          </View>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Project Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Project:</Text>
            <Text style={styles.infoValue}>{note.project_name || "—"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Site Location:</Text>
            <Text style={styles.infoValue}>{note.site_location || "—"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Reason:</Text>
            <Text style={styles.infoValue}>{note.reason_category}</Text>
          </View>
        </View>
      </View>

      {/* Financial Table */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Description</Text>
        <Text style={styles.tableHeaderRight}>Amount (₹)</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Debit Amount</Text>
        <Text style={styles.tableCellRight}>₹{Number(note.debit_amount).toLocaleString()}</Text>
      </View>
      <View style={[styles.tableRow, styles.tableRowAlt]}>
        <Text style={styles.tableCell}>Tax Amount</Text>
        <Text style={styles.tableCellRight}>₹{Number(note.tax_amount).toLocaleString()}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Deduction</Text>
        <Text style={styles.totalValue}>₹{Number(note.total_amount).toLocaleString()}</Text>
      </View>

      {/* Description */}
      <View style={styles.descBox}>
        <Text style={styles.descTitle}>Description / Remarks</Text>
        <Text style={styles.descText}>{note.description}</Text>
      </View>

      {/* Status */}
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Status:</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{note.status}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLeft}>Generated by Shree Spaace Solution Pvt. Ltd.</Text>
          <Text style={styles.footerLeft}>This is a system-generated document.</Text>
        </View>
        <View style={styles.signatureBox}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Authorized Signatory</Text>
        </View>
      </View>
    </Page>
  </Document>
)

// Export function to download PDF
export async function downloadDebitNotePDF(
  note: DebitNote & { contractor_name?: string; project_name?: string }
) {
  const blob = await pdf(<DebitNotePDF note={note} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${note.dn_number}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}
