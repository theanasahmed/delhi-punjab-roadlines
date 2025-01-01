document.addEventListener('DOMContentLoaded', function() {
    const generatePdfButton = document.getElementById('generate-pdf');
    const loadingElement = document.getElementById('loading');

    function drawTableCell(doc, text, x, y, width, height, isHeader = false) {
        doc.setFillColor(isHeader ? '#c4a6a8' : '#d4b6b8');
        doc.rect(x, y, width, height, 'F');
        doc.setDrawColor(0);
        doc.rect(x, y, width, height, 'S');
        doc.setFillColor('#000000');
        doc.text(text, x + 5, y + (height/2) + 3);
    }

    function drawSignatureBox(doc, x, y, width, height, title) {
        doc.setDrawColor(0);
        doc.line(x, y + height - 15, x + width, y + height - 15);
        doc.setFontSize(8);
        doc.text(title, x + width/2, y + height - 5, { align: 'center' });
    }

    generatePdfButton.addEventListener('click', async () => {
        try {
            loadingElement.style.display = 'block';
            generatePdfButton.disabled = true;

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'l',
                unit: 'pt',
                format: 'a4'
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 40;
            let yPos = margin;

            doc.setFillColor('#d4b6b8');
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            // Enhanced header
            doc.setFontSize(24);
            doc.setFont(undefined, 'bold');
            doc.setTextColor('#000000');
            doc.text("Delhi Punjab Roadlines", pageWidth / 2, yPos, { align: 'center' });
            yPos += 35;

            // Reduced font size for rest of the content
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');

            const rowHeight = 18;
            const colWidth = (pageWidth - (2 * margin)) / 2;

            drawTableCell(doc, "Company Details", margin, yPos, colWidth, rowHeight, true);
            drawTableCell(doc, "Contact Information", margin + colWidth, yPos, colWidth, rowHeight, true);
            yPos += rowHeight;

            const companyData = [
                ["Pan Card No. : AAIFD 9832 H", "Head Office : Payagipur Chauraha, Jaunpur Road Sultanpur"],
                ["Regd No. :", "Contact : 9415056829, 8563044829, 9005838518"],
                ["Service Provider : 0952209908S", "E-mail : delhipunjabroadline@gmail.com"]
            ];

            companyData.forEach(row => {
                drawTableCell(doc, row[0], margin, yPos, colWidth, rowHeight);
                drawTableCell(doc, row[1], margin + colWidth, yPos, colWidth, rowHeight);
                yPos += rowHeight;
            });

            yPos += 15;

            drawTableCell(doc, `Bilty No.: ${document.getElementById('biltyNo').value}`, margin, yPos, colWidth, rowHeight);
            drawTableCell(doc, `Date: ${document.getElementById('date').value}`, margin + colWidth, yPos, colWidth, rowHeight);
            yPos += rowHeight + 15;

            drawTableCell(doc, "Sender's Information", margin, yPos, colWidth, rowHeight, true);
            drawTableCell(doc, "Receiver's Information", margin + colWidth, yPos, colWidth, rowHeight, true);
            yPos += rowHeight;

            const contactInfo = [
                [`Contact: ${document.getElementById('senderContact').value}`, `Contact: ${document.getElementById('receiverContact').value}`],
                [`Address: ${document.getElementById('senderAddress').value}`, `Address: ${document.getElementById('receiverAddress').value}`]
            ];

            contactInfo.forEach(row => {
                drawTableCell(doc, row[0], margin, yPos, colWidth, rowHeight);
                drawTableCell(doc, row[1], margin + colWidth, yPos, colWidth, rowHeight);
                yPos += rowHeight;
            });

            yPos += 15;

            drawTableCell(doc, `From: ${document.getElementById('from').value}`, margin, yPos, colWidth, rowHeight);
            drawTableCell(doc, `To: ${document.getElementById('to').value}`, margin + colWidth, yPos, colWidth, rowHeight);
            yPos += rowHeight + 15;

            drawTableCell(doc, "Details", margin, yPos, colWidth, rowHeight, true);
            drawTableCell(doc, "Driver Information", margin + colWidth, yPos, colWidth, rowHeight, true);
            yPos += rowHeight;

            const tableData = [
                ["Item", "item", "Truck Number", "truckNumber"],
                ["Quantity", "quantity", "Driver Name", "driverName"],
                ["Weight", "weight", "Address", "driverAddress"],
                ["Fare Per Quintal", "farePerQuintal", "Driver's DL No.", "driverDL"],
                ["Total Fare", "totalFare", "Truck Owner", "truckOwner"],
                ["Bilty Charge", "biltyCharge", "Owner Address", "ownerAddress"],
                ["Service Charge", "serviceCharge", "Driver's Contact", "driverContact"],
                ["Guarantee Charge", "guaranteeCharge", "Owner's Contact", "ownerContact"],
                ["Fare", "fare", "", ""],
                ["Total Fare", "totalFare2", "", ""],
                ["Advance", "advance", "", ""],
                ["Payment", "payment", "", ""]
            ];

            tableData.forEach(([leftLabel, leftField, rightLabel, rightField]) => {
                const leftValue = document.getElementById(leftField)?.value || "";
                const rightValue = document.getElementById(rightField)?.value || "";
                
                drawTableCell(doc, `${leftLabel}: ${leftValue}`, margin, yPos, colWidth, rowHeight);
                if (rightLabel) {
                    drawTableCell(doc, `${rightLabel}: ${rightValue}`, margin + colWidth, yPos, colWidth, rowHeight);
                } else {
                    drawTableCell(doc, "", margin + colWidth, yPos, colWidth, rowHeight);
                }
                yPos += rowHeight;
            });

            yPos += 15;

            const signatureBoxWidth = (pageWidth - (margin * 4)) / 3;
            const signatureBoxHeight = 40;

            drawSignatureBox(doc, margin, yPos, signatureBoxWidth, signatureBoxHeight, "Driver's Signature");
            drawSignatureBox(doc, margin * 2 + signatureBoxWidth, yPos, signatureBoxWidth, signatureBoxHeight, "Merchant's Signature");
            drawSignatureBox(doc, margin * 3 + signatureBoxWidth * 2, yPos, signatureBoxWidth, signatureBoxHeight, "DPRL Broker Signature");

            doc.save('Delhi_Punjab_Roadlines_Form.pdf');

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            loadingElement.style.display = 'none';
            generatePdfButton.disabled = false;
        }
    });
});