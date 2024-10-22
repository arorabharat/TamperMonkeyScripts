import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

class MailFilterEntry {
    private String title;
    private String id;
    private String updated;
    private String label;
    private String from;
    private String shouldArchive;

    public MailFilterEntry(String title, String id, String updated, String label, String from, String shouldArchive) {
        this.title = title;
        this.id = id;
        this.updated = updated;
        this.label = label;
        this.from = from;
        this.shouldArchive = shouldArchive;
    }

    public String getLabel() {
        return label;
    }

    public String toXML() {
        return "<entry>\n" +
                "\t<category term='filter'></category>\n" +
                "\t<title>" + title + "</title>\n" +
                "\t<id>" + id + "</id>\n" +
                "\t<updated>" + updated + "</updated>\n" +
                "\t<content></content>\n" +
                "\t<apps:property name='from' value='" + from + "'/></entry>\n" + // Placeholder for 'from' property
                "\t<apps:property name='label' value='" + label + "'/>\n" +
                "\t<apps:property name='shouldArchive' value='" + shouldArchive + "'/>\n" +
                "\t<apps:property name='sizeOperator' value='s_sl'/>\n" +
                "\t<apps:property name='shouldNeverSpam' value='true'/>\n" +
                "\t<apps:property name='sizeUnit' value='s_smb'/>\n" +
                "</entry>\n";
    }
}

public class Main {

    public static void main(String[] args) {
        try {
            // Sample XML data
            String xmlData = """
                    <entries xmlns:apps="http://schemas.google.com/apps/">
                        <entry>
                            <category term='filter'></category>
                            <title>Mail Filter</title>
                            <id>tag:mail.google.com,2008:filter:z0000001709042096832*6781570282703061447</id>
                            <updated>2024-10-22T13:47:13Z</updated>
                            <content></content>
                            <apps:property name='from' value='adanigasebill@adani.com OR customercare.gas@adani.com'/>
                            <apps:property name='label' value='AdaniGas'/>
                            <apps:property name='shouldArchive' value='true'/>
                            <apps:property name='sizeOperator' value='s_sl'/>
                            <apps:property name='sizeUnit' value='s_smb'/>
                        </entry>
                        <entry>
                            <category term='filter'></category>
                            <title>Mail Filter</title>
                            <id>tag:mail.google.com,2008:filter:z0000001692391722216*3348775501706663873</id>
                            <updated>2024-10-22T13:47:13Z</updated>
                            <content></content>
                            <apps:property name='from' value='ebill@airtel.com OR update@airtel.com OR Welcome2Airtel@airtel.com OR airtelwork-mailer@airtel.com'/>
                            <apps:property name='label' value='Airtel_Broadband'/>
                            <apps:property name='sizeOperator' value='s_sl'/>
                            <apps:property name='sizeUnit' value='s_smb'/>
                        </entry>
                    </entries>
                    """;

            // Create a DocumentBuilderFactory
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true); // Enable namespace support
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(new java.io.ByteArrayInputStream(xmlData.getBytes()));

            // Normalize the XML structure
            document.getDocumentElement().normalize();

            // List to hold mail filter entries
            List<MailFilterEntry> entries = new ArrayList<>();

            // Extract entry elements
            NodeList entryList = document.getElementsByTagName("entry");
            for (int i = 0; i < entryList.getLength(); i++) {
                Element entryElement = (Element) entryList.item(i);
                String title = entryElement.getElementsByTagName("title").item(0).getTextContent();
                String id = entryElement.getElementsByTagName("id").item(0).getTextContent();
                String updated = entryElement.getElementsByTagName("updated").item(0).getTextContent();

                // Get label value
                NodeList properties = entryElement.getElementsByTagNameNS("http://schemas.google.com/apps/", "property");
                String label = "";
                String from = "";
                String shouldArchive = "";
                for (int j = 0; j < properties.getLength(); j++) {
                    Element property = (Element) properties.item(j);
                    if ("label".equals(property.getAttribute("name"))) {
                        label = property.getAttribute("value");
                    }
                    if ("from".equals(property.getAttribute("name"))) {
                        from = property.getAttribute("value");
                    }
                    if ("shouldArchive".equals(property.getAttribute("name"))) {
                        shouldArchive = property.getAttribute("value");
                    }
                }

                // Create MailFilterEntry object and add to the list
                MailFilterEntry entry = new MailFilterEntry(title, id, updated, label, from, shouldArchive);
                entries.add(entry);
            }

            // Sort the entries based on the label value
            Collections.sort(entries, Comparator.comparing(MailFilterEntry::getLabel));

            // Print sorted entries as XML
            System.out.println("<entries>");
            for (MailFilterEntry entry : entries) {
                System.out.println(entry.toXML());
            }
            System.out.println("</entries>");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
