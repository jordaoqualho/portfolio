import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Locale } from "@/i18n/config";
import { buildResume, type Resume } from "./resume";

// Break lines between words only: "Architecture" never becomes "Archi-tecture".
Font.registerHyphenationCallback((word) => [word]);

// A one-column, ATS-friendly layout: real text (no images), standard fonts,
// one heading per section and the dates on the same line as each role.
const ink = "#1f1f1f";
const muted = "#3a3a3a";

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 34,
    paddingHorizontal: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.25,
    color: ink,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    lineHeight: 1.15,
    textAlign: "center",
    letterSpacing: 0.4,
  },
  contact: {
    marginTop: 4,
    fontSize: 9.5,
    textAlign: "center",
    color: muted,
  },
  link: { color: muted, textDecoration: "none" },
  rule: {
    marginTop: 12,
    marginBottom: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: ink,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 4,
  },
  role: { marginTop: 6, marginBottom: 4 },
  roleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  roleHeading: { fontFamily: "Helvetica-Bold", flex: 1, paddingRight: 12 },
  roleDates: { fontFamily: "Helvetica-Bold" },
  roleNote: { fontFamily: "Helvetica-Oblique", color: muted, marginBottom: 2 },
  point: { flexDirection: "row", paddingLeft: 10 },
  bullet: { width: 10 },
  pointText: { flex: 1 },
  bold: { fontFamily: "Helvetica-Bold" },
  skillLine: { marginBottom: 1 },
  languagesTitle: { fontFamily: "Helvetica-Bold", marginTop: 8 },
});

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.point}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.pointText}>{children}</Text>
    </View>
  );
}

export function ResumeDocument({ data }: { data: Resume }) {
  return (
    <Document
      title={`${data.name} — ${data.role} ${data.labels.title}`}
      author={data.name}
      subject={`${data.role} ${data.labels.title}`}
      keywords={data.skills.map((s) => s.items).join(", ")}
      creator={data.contact.at(-1)?.label}
      producer={data.contact.at(-1)?.label}
      language={data.labels.language}
    >
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.name}>{data.name.toUpperCase()}</Text>
        <Text style={styles.contact}>
          {data.contact.map((item, i) => (
            <Text key={item.label}>
              {i > 0 ? "  •  " : ""}
              {item.href ? (
                <Link src={item.href} style={styles.link}>
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </Text>
          ))}
        </Text>

        <View style={styles.rule} />
        <Text style={styles.sectionTitle}>{data.labels.summary}</Text>
        <Text>{data.summary}</Text>

        <View style={styles.rule} />
        <Text style={styles.sectionTitle}>{data.labels.experience}</Text>
        {data.roles.map((role) => (
          // A role never splits across pages; it moves whole to the next one.
          <View key={role.heading} style={styles.role} wrap={false}>
            <View style={styles.roleHeader}>
              <Text style={styles.roleHeading}>{role.heading}</Text>
              <Text style={styles.roleDates}>{role.dates}</Text>
            </View>
            {role.note && <Text style={styles.roleNote}>{role.note}</Text>}
            {role.points.map((point) => (
              <Bullet key={point}>{point}</Bullet>
            ))}
            <Text>
              <Text style={styles.bold}>{data.labels.technologies}</Text>: {role.technologies}
            </Text>
          </View>
        ))}

        <View>
          <Text style={[styles.sectionTitle, { marginTop: 8 }]} minPresenceAhead={60}>
            {data.labels.additional}
          </Text>
          {data.skills.map((group) => (
            <Text key={group.group} style={styles.skillLine}>
              <Text style={styles.bold}>{group.group}:</Text> {group.items}
            </Text>
          ))}
          <View wrap={false}>
            <Text style={styles.languagesTitle}>{data.labels.languages}:</Text>
            {data.languages.map((language) => (
              <Bullet key={language}>{language}</Bullet>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}

// The CV PDF in one language, generated from the site's content.
export function renderResumePdf(data: Resume = buildResume()) {
  return renderToBuffer(<ResumeDocument data={data} />);
}

// Response for the route handlers under src/app/resume/<file name>/.
export async function resumePdfResponse(locale: Locale) {
  const data = buildResume(locale);
  const pdf = await renderResumePdf(data);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${data.fileName}"`,
    },
  });
}
