export async function updateHeaders({ docs, documentId }) {
    // Find tables
    const res = await docs.documents.get({ documentId });
    const body = res.data.body.content;
    const table = body.find((el) => el.table);
    if (!table) {
        console.log('\x1b[31m%s\x1b[0m', 'No Table :( Please add a 1x4 table to continue');
        return;
    }

    // Update header
    const headerData = ['Chủ đề', 'Mã bài', 'Tên bài', 'Trạng thái'];
    const headerCell = table.table.tableRows[0].tableCells;
    const headerRequests = [];
    for (let i = 0; i < headerData.length; i++) {
        const txt = headerData[i];
        const cell = headerCell[i];
        const cellRequests = [];
        if (cell.startIndex + 1 < cell.endIndex - 1) {
            cellRequests.push({
                deleteContentRange: {
                    range: {
                        startIndex: cell.startIndex + 1,
                        endIndex: cell.endIndex - 1,
                    },
                },
            });
        }
        cellRequests.push({
            insertText: {
                text: txt,
                location: {
                    index: cell.startIndex + 1,
                },
            },
        });
        headerRequests.push(cellRequests);
    }
    const finalHeaderRequests = headerRequests.reverse().flat();
    await docs.documents.batchUpdate({
        documentId,
        requestBody: {
            requests: finalHeaderRequests,
        },
    });
    console.log('\x1b[32m%s\x1b[0m', 'Table Headers Updated!');

    return target_id;
}

export async function addRow({ docs, documentId, row_num }) {
    // Find tables
    const res = await docs.documents.get({ documentId });
    const body = res.data.body.content;
    const table = body.find((el) => el.table);
    if (!table) {
        console.log('\x1b[31m%s\x1b[0m', 'No Table :( Please add a 1x4 table to continue');
        return;
    }
    const target_id = table.table.tableRows.length - 1;

    if (row_num - target_id <= 0) {
        console.log('\x1b[33m%s\x1b[0m', 'No Rows Added!');
        return;
    }
    // Insert new rows
    const requests = Array.from({ length: row_num - target_id }, () => ({
        insertTableRow: {
            tableCellLocation: {
                tableStartLocation: {
                    index: table.startIndex,
                },
                rowIndex: target_id,
                columnIndex: 0,
            },
            insertBelow: true,
        },
    }));
    if (requests.length > 0) {
        await docs.documents.batchUpdate({
            documentId,
            requestBody: {
                requests,
            },
        });
        console.log(
            '\x1b[32m%s\x1b[0m',
            ((row_num - target_id > 1) ? (row_num - target_id + ' Rows') : '1 Row') + ' Added!',
        );
    } else {
        console.log('\x1b[33m%s\x1b[0m', 'No Rows Added!.');
    }
}

export async function updateData({ docs, documentId, target_id, question_list }) {
    // Find tables
    const res = await docs.documents.get({ documentId });
    const body = res.data.body.content;
    const table = body.find((el) => el.table);
    if (!table) {
        console.log('\x1b[31m%s\x1b[0m', 'No Table :( Please add a 1x4 table to continue');
        return;
    }

    // Update the body
    const bodyData = question_list.map((obj) => [obj.problemTopic, obj.problemID, obj.problemName, 'AC']);
    const bodyRequests = [];
    bodyData.forEach((item, offset) => {
        for (let i = 0; i < 4; i++) {
            const txt = item[i] || 'NO DATA';
            const cell = table.table.tableRows[target_id + offset].tableCells[i];
            const cellRequests = [];
            if (cell.startIndex + 1 < cell.endIndex - 1) {
                cellRequests.push({
                    deleteContentRange: {
                        range: {
                            startIndex: cell.startIndex + 1,
                            endIndex: cell.endIndex - 1,
                        },
                    },
                });
            }
            cellRequests.push({
                insertText: {
                    text: txt,
                    location: {
                        index: cell.startIndex + 1,
                    },
                },
            });
            bodyRequests.push(cellRequests);
        }
    });

    const finalBodyRequests = bodyRequests.reverse().flat();
    if (finalBodyRequests.length > 0) {
        await docs.documents.batchUpdate({
            documentId,
            requestBody: {
                requests: finalBodyRequests,
            },
        });
        console.log('\x1b[32m%s\x1b[0m', 'Table Body Updated!');
    } else {
        console.log('\x1b[33m%s\x1b[0m', 'No data to update in the table body.');
    }
}
