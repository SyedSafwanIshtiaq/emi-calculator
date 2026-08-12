const loanTypes = {
    CAR: {
        name: "CAR Loan",
        icon: "🚗"
    },

    BIKE: {
        name: "BIKE Loan",
        icon: "🏍️"
    },

    MOBILE: {
        name: "MOBILE Loan",
        icon: "📱"
    },

    HOME: {
        name: "HOME Loan",
        icon: "🏠"
    },

    GOLD: {
        name: "GOLD Loan",
        icon: "🪙"
    },

    PERSONAL: {
        name: "PERSONAL Loan",
        icon: "💼"
    }
};


const loanAmount = document.getElementById("loanAmount");
const loanAmountNumber = document.getElementById("loanAmountNumber");

const interestRate = document.getElementById("interestRate");
const interestNumber = document.getElementById("interestNumber");

const tenure = document.getElementById("tenure");
const tenureNumber = document.getElementById("tenureNumber");

const amountValue = document.getElementById("amountValue");
const interestValue = document.getElementById("interestValue");
const tenureValue = document.getElementById("tenureValue");

const monthlyEMI = document.getElementById("monthlyEMI");
const totalInterest = document.getElementById("totalInterest");
const totalAmount = document.getElementById("totalAmount");
const duration = document.getElementById("duration");

const selectedCategory =
    document.getElementById("selectedCategory");

const selectedIcon =
    document.getElementById("selectedIcon");


/* CURRENCY */

function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value);
}


/* CALCULATE EMI */

function calculateEMI() {

    const principal = Number(loanAmount.value);
    const annualRate = Number(interestRate.value);
    const years = Number(tenure.value);

    const months = years * 12;

    const monthlyRate = annualRate / 12 / 100;

    let emi;

    if (monthlyRate === 0) {
        emi = principal / months;
    } else {

        emi =
            principal *
            monthlyRate *
            Math.pow(1 + monthlyRate, months) /
            (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayable = emi * months;
    const interest = totalPayable - principal;

    monthlyEMI.textContent = formatCurrency(emi);
    totalInterest.textContent = formatCurrency(interest);
    totalAmount.textContent = formatCurrency(totalPayable);

    amountValue.textContent = formatCurrency(principal);
    interestValue.textContent = `${annualRate}%`;
    tenureValue.textContent =
        `${years} ${years === 1 ? "Year" : "Years"}`;

    duration.textContent =
        `${months} ${months === 1 ? "month" : "months"}`;
}


/* SYNC SLIDER + NUMBER INPUT */

loanAmount.addEventListener("input", () => {

    loanAmountNumber.value = loanAmount.value;

    calculateEMI();
});


loanAmountNumber.addEventListener("input", () => {

    let value = Number(loanAmountNumber.value);

    if (value < 10000) value = 10000;

    if (value > 10000000) value = 10000000;

    loanAmount.value = value;

    calculateEMI();
});


interestRate.addEventListener("input", () => {

    interestNumber.value = interestRate.value;

    calculateEMI();
});


interestNumber.addEventListener("input", () => {

    let value = Number(interestNumber.value);

    if (value < 0) value = 0;

    if (value > 30) value = 30;

    interestRate.value = value;

    calculateEMI();
});


tenure.addEventListener("input", () => {

    tenureNumber.value = tenure.value;

    calculateEMI();
});


tenureNumber.addEventListener("input", () => {

    let value = Number(tenureNumber.value);

    if (value < 1) value = 1;

    if (value > 30) value = 30;

    tenure.value = value;

    calculateEMI();
});


/* LOAN CATEGORY */

document.querySelectorAll(".loan-type").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".loan-type")
            .forEach(item => item.classList.remove("active"));

        button.classList.add("active");

        const type = button.dataset.type;
        const loan = loanTypes[type];

        selectedCategory.textContent = loan.name;
        selectedIcon.textContent = loan.icon;
    });

});


/* DOWNLOAD BASIC RESULT */

document
    .getElementById("downloadPDF")
    .addEventListener("click", () => {

        const content = `
EMI CALCULATOR
==============

Loan Type: ${selectedCategory.textContent}

Loan Amount: ${loanAmountNumber.value}
Annual Interest Rate: ${interestNumber.value}%
Tenure: ${tenureNumber.value} years

Monthly EMI: ${monthlyEMI.textContent}
Total Interest: ${totalInterest.textContent}
Total Amount Payable: ${totalAmount.textContent}

Duration: ${duration.textContent}
        `;

        downloadTextFile(
            content,
            "emi-calculation.txt"
        );
    });


/* PAYMENT SCHEDULE */

document
    .getElementById("schedulePDF")
    .addEventListener("click", () => {

        const principal = Number(loanAmount.value);
        const annualRate = Number(interestRate.value);
        const years = Number(tenure.value);

        const months = years * 12;
        const monthlyRate = annualRate / 12 / 100;

        let emi;

        if (monthlyRate === 0) {

            emi = principal / months;

        } else {

            emi =
                principal *
                monthlyRate *
                Math.pow(1 + monthlyRate, months) /
                (Math.pow(1 + monthlyRate, months) - 1);
        }

        let balance = principal;

        let schedule = `
EMI PAYMENT SCHEDULE

Loan Type: ${selectedCategory.textContent}
Loan Amount: ${formatCurrency(principal)}
Interest Rate: ${annualRate}%
Tenure: ${years} years
Monthly EMI: ${formatCurrency(emi)}

----------------------------------------

Month | EMI | Interest | Principal | Balance
`;

        for (let month = 1; month <= months; month++) {

            const interest = balance * monthlyRate;

            const principalPaid = emi - interest;

            balance -= principalPaid;

            if (balance < 0) balance = 0;

            schedule += `
${month} | ${formatCurrency(emi)} | ${formatCurrency(interest)} | ${formatCurrency(principalPaid)} | ${formatCurrency(balance)}
`;
        }

        downloadTextFile(
            schedule,
            "emi-payment-schedule.txt"
        );
    });


/* EMAIL */

document
    .getElementById("emailResult")
    .addEventListener("click", () => {

        const subject = encodeURIComponent(
            "My EMI Calculation"
        );

        const body = encodeURIComponent(
            `EMI Calculation

Loan Type: ${selectedCategory.textContent}
Loan Amount: ${formatCurrency(Number(loanAmount.value))}
Interest Rate: ${interestNumber.value}%
Tenure: ${tenureNumber.value} years

Monthly EMI: ${monthlyEMI.textContent}
Total Interest: ${totalInterest.textContent}
Total Amount: ${totalAmount.textContent}`
        );

        window.location.href =
            `mailto:?subject=${subject}&body=${body}`;
    });


/* SMS */

document
    .getElementById("smsResult")
    .addEventListener("click", () => {

        const message = encodeURIComponent(
            `EMI: ${monthlyEMI.textContent} | Total Interest: ${totalInterest.textContent} | Total Amount: ${totalAmount.textContent}`
        );

        window.location.href =
            `sms:?body=${message}`;
    });


/* DOWNLOAD TEXT FILE */

function downloadTextFile(content, filename) {

    const blob = new Blob(
        [content],
        { type: "text/plain" }
    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
}


/* YEAR */

document.getElementById("year").textContent =
    new Date().getFullYear();


/* INITIAL CALCULATION */

calculateEMI();