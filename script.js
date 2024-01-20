function analyzeFile() {
    const fileInput = document.getElementById('fileInput');
    const outputDiv = document.getElementById('output');

    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = e.target.result;
            processData(data);
        };

        reader.readAsText(file);
    } else {
        alert('Please select a file.');
    }
}

function processData(data) {
    const rows = data.split('\n').map(row => row.split(','));

    const positionIdIndex = 0;
    const timeIndex = 2;
    const employeeNameIndex = 7;

    const consecutiveDaysEmployees = [];
    const lessThan10HoursEmployees = [];
    const moreThan14HoursEmployees = [];

    for (let i = 1; i < rows.length; i++) {
        const currentRow = rows[i];

        // Check for 7 consecutive days
        if (i < rows.length - 6) {
            const worked7Days = checkConsecutiveDays(currentRow, rows.slice(i + 1, i + 7));
            if (worked7Days) {
                consecutiveDaysEmployees.push(currentRow[employeeNameIndex].trim());
            }
        }

        // Check for less than 10 hours between shifts
        if (i < rows.length - 1) {
            const timeDiff = getTimeDifference(currentRow[timeIndex], rows[i + 1][timeIndex]);
            if (timeDiff < 10 && timeDiff > 1) {
                lessThan10HoursEmployees.push(currentRow[employeeNameIndex].trim());
            }
        }

        // Check for more than 14 hours in a single shift
        const singleShiftHours = getHoursFromTime(currentRow[4]);
        if (singleShiftHours > 14) {
            moreThan14HoursEmployees.push(currentRow[employeeNameIndex].trim());
        }
    }

    // Display results
    displayResults(consecutiveDaysEmployees, lessThan10HoursEmployees, moreThan14HoursEmployees);
}

function checkConsecutiveDays(currentRow, nextSixRows) {
    const currentDate = new Date(currentRow[2]);

    for (let i = 0; i < nextSixRows.length; i++) {
        const nextRowDate = new Date(nextSixRows[i][2]);
        const dateDiff = Math.abs(currentDate - nextRowDate) / (1000 * 60 * 60 * 24);

        if (dateDiff !== 1) {
            return false;
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return true;
}

function getTimeDifference(time1, time2) {
    const date1 = new Date('1970-01-01 ' + time1);
    const date2 = new Date('1970-01-01 ' + time2);
    const diff = Math.abs(date2 - date1) / (1000 * 60 * 60);
    return diff;
}

function getHoursFromTime(time) {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) + parseInt(minutes) / 60;
}

function displayResults(consecutiveDaysEmployees, lessThan10HoursEmployees, moreThan14HoursEmployees) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    outputDiv.innerHTML += `<p>Employees who worked for 7 consecutive days: ${consecutiveDaysEmployees.join(', ')}</p>`;
    outputDiv.innerHTML += `<p>Employees with less than 10 hours between shifts: ${lessThan10HoursEmployees.join(', ')}</p>`;
    outputDiv.innerHTML += `<p>Employees who worked for more than 14 hours in a single shift: ${moreThan14HoursEmployees.join(', ')}</p>`;
}
