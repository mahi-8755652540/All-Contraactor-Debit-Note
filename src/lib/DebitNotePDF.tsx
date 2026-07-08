import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer"
import type { DebitNote } from "@/lib/supabase"

const C = {
  blue: "#1d4ed8",
  lightBlue: "#eff6ff",
  borderBlue: "#bfdbfe",
  dark: "#0f172a",
  mid: "#334155",
  muted: "#64748b",
  light: "#f1f5f9",
  border: "#e2e8f0",
  white: "#ffffff",
  green: "#15803d",
  greenBg: "#dcfce7",
  red: "#b91c1c",
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    backgroundColor: C.white,
    color: C.dark,
  },
  // Top accent bar
  topBar: {
    backgroundColor: C.blue,
    height: 6,
  },
  body: {
    padding: "28 40 40 40",
  },
  // ── Header ──
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  companyBlock: {},
  companyName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: C.blue,
    letterSpacing: 0.5,
  },
  companyTagline: {
    fontSize: 8,
    color: C.muted,
    marginTop: 2,
  },
  companyInfo: {
    fontSize: 8,
    color: C.muted,
    marginTop: 1,
  },
  dnBox: {
    backgroundColor: C.lightBlue,
    borderWidth: 1,
    borderColor: C.borderBlue,
    borderRadius: 6,
    padding: "10 14",
    alignItems: "flex-end",
    minWidth: 160,
  },
  dnLabel: {
    fontSize: 7,
    color: C.blue,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  dnNumber: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
    marginTop: 3,
  },
  dnDate: {
    fontSize: 8,
    color: C.muted,
    marginTop: 4,
  },

  // ── Divider ──
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: C.blue,
    marginBottom: 18,
  },

  // ── Title ──
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  titleText: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.blue,
    letterSpacing: 3,
    textTransform: "uppercase",
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: C.blue,
    paddingBottom: 4,
  },

  // ── Parties (Issued By / Issued To) ──
  partiesRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 18,
  },
  partyBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 5,
    padding: "10 12",
  },
  partyBoxIssued: {
    backgroundColor: C.light,
  },
  partyTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.blue,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.borderBlue,
    paddingBottom: 4,
  },
  partyRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  partyLabel: {
    fontSize: 8,
    color: C.muted,
    width: 80,
  },
  partyValue: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
    flex: 1,
  },

  // ── Financial Table ──
  tableContainer: {
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 5,
    overflow: "hidden",
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: C.dark,
    padding: "8 12",
  },
  tableHeadCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  tableHeadRight: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    textAlign: "right",
    width: 90,
  },
  tableRow: {
    flexDirection: "row",
    padding: "9 12",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    alignItems: "center",
  },
  tableRowAlt: {
    backgroundColor: C.light,
  },
  tableCell: {
    fontSize: 9,
    color: C.mid,
    flex: 1,
  },
  tableCellRight: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
    textAlign: "right",
    width: 90,
  },
  totalRow: {
    flexDirection: "row",
    padding: "11 12",
    backgroundColor: C.blue,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    flex: 1,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    textAlign: "right",
    width: 90,
  },

  // ── Description ──
  descBox: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 5,
    padding: "10 12",
    marginBottom: 14,
    backgroundColor: C.light,
  },
  descTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.blue,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  descText: {
    fontSize: 9,
    color: C.mid,
    lineHeight: 1.6,
  },

  // ── Status + Notes ──
  bottomRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 30,
  },
  statusBox: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 5,
    padding: "8 12",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusLabel: {
    fontSize: 8,
    color: C.muted,
  },
  statusPill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: C.greenBg,
  },
  statusText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.green,
  },
  noteBox: {
    borderWidth: 1,
    borderColor: C.borderBlue,
    borderRadius: 5,
    padding: "8 12",
    flex: 2,
    backgroundColor: C.lightBlue,
  },
  noteText: {
    fontSize: 8,
    color: C.blue,
    lineHeight: 1.5,
  },

  // ── Signature Row ──
  sigRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  sigBlock: {
    alignItems: "center",
    width: 160,
  },
  sigLine: {
    borderTopWidth: 1,
    borderTopColor: C.mid,
    width: 150,
    marginBottom: 4,
  },
  sigLabel: {
    fontSize: 8,
    color: C.muted,
    textAlign: "center",
  },
  sigName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
    textAlign: "center",
  },

  // ── Footer ──
  footer: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    fontSize: 7,
    color: C.muted,
  },
  footerRight: {
    fontSize: 7,
    color: C.muted,
    textAlign: "right",
  },
  bottomAccent: {
    backgroundColor: C.blue,
    height: 4,
    marginTop: 16,
  },
})

const fmt = (n: number) => `Rs. ${Number(n).toLocaleString("en-IN")}`

type NoteProps = DebitNote & { contractor_name?: string; project_name?: string }

const DebitNotePDF = ({ note }: { note: NoteProps }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.topBar} />
      <View style={styles.body}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>Shree Spaace Solution</Text>
            <Text style={styles.companyTagline}>Private Limited</Text>
            <Text style={styles.companyInfo}>info@shreespaace.com</Text>
            <Text style={styles.companyInfo}>Mumbai, Maharashtra</Text>
          </View>
          <View style={styles.dnBox}>
            <Text style={styles.dnLabel}>Debit Note No.</Text>
            <Text style={styles.dnNumber}>{note.dn_number}</Text>
            <Text style={styles.dnDate}>Date: {note.date_issued}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>Debit Note</Text>
        </View>

        {/* Parties */}
        <View style={styles.partiesRow}>
          <View style={[styles.partyBox, styles.partyBoxIssued]}>
            <Text style={styles.partyTitle}>Issued By</Text>
            <View style={styles.partyRow}>
              <Text style={styles.partyLabel}>Company:</Text>
              <Text style={styles.partyValue}>Shree Spaace Solution Pvt. Ltd.</Text>
            </View>
            <View style={styles.partyRow}>
              <Text style={styles.partyLabel}>Address:</Text>
              <Text style={styles.partyValue}>Mumbai, Maharashtra</Text>
            </View>
            <View style={styles.partyRow}>
              <Text style={styles.partyLabel}>Email:</Text>
              <Text style={styles.partyValue}>info@shreespaace.com</Text>
            </View>
          </View>

          <View style={styles.partyBox}>
            <Text style={styles.partyTitle}>Issued To (Contractor)</Text>
            <View style={styles.partyRow}>
              <Text style={styles.partyLabel}>Company:</Text>
              <Text style={styles.partyValue}>{note.contractor_name || "—"}</Text>
            </View>
            <View style={styles.partyRow}>
              <Text style={styles.partyLabel}>Project:</Text>
              <Text style={styles.partyValue}>{note.project_name || "—"}</Text>
            </View>
            <View style={styles.partyRow}>
              <Text style={styles.partyLabel}>Site Location:</Text>
              <Text style={styles.partyValue}>{note.site_location || "—"}</Text>
            </View>
            <View style={styles.partyRow}>
              <Text style={styles.partyLabel}>Orig. Invoice:</Text>
              <Text style={styles.partyValue}>{note.original_invoice || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Financial Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHead}>
            <Text style={[styles.tableHeadCell, { flex: 1 }]}>Description</Text>
            <Text style={styles.tableHeadRight}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              Reason: {note.reason_category}
            </Text>
            <Text style={styles.tableCellRight}>{fmt(note.debit_amount)}</Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={styles.tableCell}>Applicable Tax / Other Charges</Text>
            <Text style={styles.tableCellRight}>{fmt(note.tax_amount)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount to be Deducted</Text>
            <Text style={styles.totalValue}>{fmt(note.total_amount)}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descBox}>
          <Text style={styles.descTitle}>Description / Remarks</Text>
          <Text style={styles.descText}>{note.description}</Text>
        </View>

        {/* Status + Note */}
        <View style={styles.bottomRow}>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Status:</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{note.status}</Text>
            </View>
          </View>
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              Note: This debit note is issued against the above contractor for the reason mentioned. The amount will be deducted from the upcoming payout as per the contract terms and conditions agreed upon.
            </Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.sigRow}>
          <View style={styles.sigBlock}>
            <View style={styles.sigLine} />
            <Text style={styles.sigName}>Contractor Representative</Text>
            <Text style={styles.sigLabel}>Signature & Stamp</Text>
          </View>
          <View style={styles.sigBlock}>
            <View style={styles.sigLine} />
            <Text style={styles.sigName}>Authorized Signatory</Text>
            <Text style={styles.sigLabel}>Shree Spaace Solution Pvt. Ltd.</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>
            Generated by Shree Spaace Solution Pvt. Ltd. | System-generated document — no physical signature required.
          </Text>
          <Text style={styles.footerRight}>
            {note.dn_number} | {note.date_issued}
          </Text>
        </View>
      </View>
      <View style={styles.bottomAccent} />
    </Page>
  </Document>
)

export async function downloadDebitNotePDF(note: NoteProps) {
  const blob = await pdf(<DebitNotePDF note={note} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${note.dn_number}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}
