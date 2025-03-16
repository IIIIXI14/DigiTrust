class FraudDetectionSystem {
    constructor() {
        this.model = null;
        this.isTraining = false;
        this.setupEventListeners();
        this.setupCharts();
    }

    setupEventListeners() {
        document.getElementById('trainButton').addEventListener('click', () => this.trainModel());
        document.getElementById('checkButton').addEventListener('click', () => this.checkTransaction());
        document.getElementById('time').addEventListener('change', this.updateTimeDisplay);
    }

    setupCharts() {
        const data = [{
            type: 'indicator',
            mode: 'gauge+number',
            value: 0,
            title: { 
                text: 'Risk Level',
                font: { size: 24 }
            },
            number: {
                font: { size: 36 },
                suffix: '%'
            },
            gauge: {
                axis: { 
                    range: [0, 100],
                    tickwidth: 1,
                    tickcolor: "#666",
                    tickmode: 'array',
                    tickvals: [0, 30, 70, 100],
                    ticktext: ['0%', '30%', '70%', '100%']
                },
                bar: { thickness: 0 },
                bgcolor: 'white',
                borderwidth: 2,
                bordercolor: '#ccc',
                steps: [
                    { range: [0, 30], color: 'rgba(76, 175, 80, 0.8)' },   // Green with opacity
                    { range: [30, 70], color: 'rgba(255, 167, 38, 0.8)' }, // Orange with opacity
                    { range: [70, 100], color: 'rgba(239, 83, 80, 0.8)' }  // Red with opacity
                ],
                threshold: {
                    line: { color: "black", width: 4 },
                    thickness: 0.75,
                    value: 0
                }
            }
        }];

        const layout = {
            width: 300,
            height: 250,
            margin: { t: 40, r: 25, l: 25, b: 0 },
            paper_bgcolor: 'white',
            font: { color: '#2c3e50', family: 'Arial' }
        };

        const config = {
            responsive: true,
            displayModeBar: false
        };

        Plotly.newPlot('confidenceChart', data, layout, config);
    }

    async trainModel() {
        if (this.isTraining) return;

        try {
            this.isTraining = true;
            this.showAlert('Training model with extensive data...', 'info');
            document.getElementById('trainingStatus').style.display = 'block';
            const progressBar = document.querySelector('.progress-bar');
            
            // Create model with deeper architecture
            this.model = tf.sequential();
            
            this.model.add(tf.layers.dense({
                units: 64,
                activation: 'relu',
                inputShape: [6]
            }));
            
            this.model.add(tf.layers.dropout(0.2));
            
            this.model.add(tf.layers.dense({
                units: 32,
                activation: 'relu'
            }));
            
            this.model.add(tf.layers.dropout(0.2));
            
            this.model.add(tf.layers.dense({
                units: 16,
                activation: 'relu'
            }));
            
            this.model.add(tf.layers.dense({
                units: 1,
                activation: 'sigmoid'
            }));
            
            this.model.compile({
                optimizer: tf.train.adam(0.001),
                loss: 'binaryCrossentropy',
                metrics: ['accuracy']
            });

            // Generate 20,000 training samples
            const numSamples = 20000;
            const batchSize = 100;
            const batches = Math.ceil(numSamples / batchSize);
            
            const allFeatures = [];
            const allLabels = [];

            for (let batch = 0; batch < batches; batch++) {
                const features = [];
                const labels = [];
                
                for (let i = 0; i < batchSize; i++) {
                    const feature = this.generateRandomFeatures();
                    features.push(feature);
                    
                    // Calculate risk based on complex rules
                    const baseRisk = this.calculateRiskScore(feature);
                    const randomVariation = (Math.random() - 0.5) * 0.1; // Add some noise
                    const finalRisk = Math.max(0, Math.min(1, baseRisk + randomVariation));
                    
                    labels.push(finalRisk > 0.7 ? 1 : 0);
                }
                
                allFeatures.push(...features);
                allLabels.push(...labels);
                
                const progress = ((batch + 1) / batches) * 100;
                progressBar.style.width = `${progress}%`;
                
                // Allow UI to update
                if (batch % 10 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }

            const xs = tf.tensor2d(allFeatures);
            const ys = tf.tensor2d(allLabels.map(l => [l]));

            // Train with more epochs and validation
            await this.model.fit(xs, ys, {
                epochs: 50,
                batchSize: 128,
                shuffle: true,
                validationSplit: 0.2,
                callbacks: {
                    onEpochEnd: async (epoch, logs) => {
                        const progress = ((epoch + 1) / 50) * 100;
                        this.showAlert(`Training progress: ${progress.toFixed(1)}% (Loss: ${logs.loss.toFixed(4)})`, 'info');
                        await new Promise(resolve => setTimeout(resolve, 0));
                    }
                }
            });

            xs.dispose();
            ys.dispose();

            this.isTraining = false;
            document.getElementById('trainingStatus').style.display = 'none';
            this.showAlert('Model trained successfully with 20,000 samples!', 'success');
            this.updateConfidenceChart(0);
        } catch (error) {
            console.error('Training error:', error);
            this.isTraining = false;
            document.getElementById('trainingStatus').style.display = 'none';
            this.showAlert('Error training model. Please try again.', 'danger');
        }
    }

    generateRandomFeatures() {
        // Generate realistic transaction amounts based on income levels
        const incomeRanges = {
            low: { min: 1000, max: 25000, usual: 15000 },
            middle: { min: 5000, max: 50000, usual: 30000 },
            upper: { min: 10000, max: 200000, usual: 75000 }
        };

        // Select random income level
        const income = ['low', 'middle', 'upper'][Math.floor(Math.random() * 3)];
        const range = incomeRanges[income];
        
        // Generate amount with higher probability around usual spending
        let amount;
        const rand = Math.random();
        if (rand < 0.7) { // 70% chance of usual spending
            amount = range.usual + (Math.random() - 0.5) * range.usual;
        } else if (rand < 0.9) { // 20% chance of low spending
            amount = range.min + Math.random() * (range.usual - range.min);
        } else { // 10% chance of high spending
            amount = range.usual + Math.random() * (range.max - range.usual);
        }

        // Time generation with realistic patterns
        let hour;
        const timeRand = Math.random();
        if (timeRand < 0.6) { // 60% during business hours
            hour = 9 + Math.floor(Math.random() * 9); // 9 AM to 5 PM
        } else if (timeRand < 0.9) { // 30% during evening
            hour = 18 + Math.floor(Math.random() * 4); // 6 PM to 9 PM
        } else { // 10% during late night
            hour = Math.floor(Math.random() * 24);
        }

        // Location with population-based probability
        const locations = {
            mumbai: 0.25, delhi: 0.2, bangalore: 0.15,
            hyderabad: 0.1, chennai: 0.1, kolkata: 0.1,
            pune: 0.05, other: 0.05
        };
        const location = this.weightedRandom(locations);

        // Transaction types with realistic combinations
        const merchantTypes = this.generateRealisticMerchantTypes();

        // Payment modes based on amount
        const paymentMode = this.selectPaymentMode(amount);

        return [
            this.normalizeAmount(amount),
            this.getIncomeRisk(income),
            this.getTimeRisk(`${hour}:00`),
            this.getLocationRisk(location),
            this.getMerchantRisk(merchantTypes),
            this.getTransactionModeRisk(paymentMode)
        ];
    }

    weightedRandom(weights) {
        const rand = Math.random();
        let sum = 0;
        for (const [item, weight] of Object.entries(weights)) {
            sum += weight;
            if (rand < sum) return item;
        }
        return Object.keys(weights)[0];
    }

    generateRealisticMerchantTypes() {
        const categories = {
            essential: ['groceries', 'utilities', 'medical', 'education', 'rent'],
            shopping: ['electronics', 'fashion', 'jewelry', 'furniture', 'beauty'],
            services: ['travel', 'entertainment', 'dining', 'salon', 'repair'],
            financial: ['investment', 'insurance', 'transfer', 'loan', 'crypto'],
            business: ['b2b', 'wholesale', 'software', 'consulting', 'marketing']
        };

        const types = [];
        const numTypes = Math.random() < 0.8 ? 1 : Math.floor(Math.random() * 3) + 1;
        
        // Select primary category based on probability
        const categoryProbs = {
            essential: 0.4, shopping: 0.25, services: 0.2,
            financial: 0.1, business: 0.05
        };
        
        const primaryCategory = this.weightedRandom(categoryProbs);
        types.push(categories[primaryCategory][Math.floor(Math.random() * categories[primaryCategory].length)]);

        // Add additional types if needed
        if (numTypes > 1) {
            const allTypes = Object.values(categories).flat();
            while (types.length < numTypes) {
                const type = allTypes[Math.floor(Math.random() * allTypes.length)];
                if (!types.includes(type)) types.push(type);
            }
        }

        return types;
    }

    selectPaymentMode(amount) {
        const modes = {
            upi: { max: 100000, prob: 0.4 },
            debit: { max: 200000, prob: 0.3 },
            credit: { max: 500000, prob: 0.15 },
            netbanking: { max: 1000000, prob: 0.1 },
            wallet: { max: 50000, prob: 0.05 }
        };

        // Filter modes by amount
        const validModes = Object.entries(modes)
            .filter(([_, info]) => amount <= info.max)
            .reduce((acc, [mode, info]) => {
                acc[mode] = info.prob;
                return acc;
            }, {});

        return this.weightedRandom(validModes) || 'netbanking';
    }

    async checkTransaction() {
        if (!this.model) {
            this.showAlert('Please train the model first!', 'warning');
            return;
        }

        const features = this.extractFeatures();
        if (!features) return;

        try {
            const inputTensor = tf.tensor2d([features]);
            const prediction = await this.model.predict(inputTensor).data();
            inputTensor.dispose();

            const riskScore = prediction[0] * 100;
            this.updateConfidenceChart(riskScore);
            this.showRiskAssessment(riskScore);
        } catch (error) {
            console.error('Prediction error:', error);
            this.showAlert('Error checking transaction. Please try again.', 'danger');
        }
    }

    extractFeatures() {
        const amount = parseFloat(document.getElementById('amount').value);
        const income = document.getElementById('income').value;
        const time = document.getElementById('time').value;
        const location = document.getElementById('location').value;
        const merchantTypes = Array.from(document.getElementById('merchantType').selectedOptions).map(opt => opt.value);
        const transactionMode = document.getElementById('transactionMode').value;

        if (!this.validateInputs(amount, income, time, location, merchantTypes, transactionMode)) {
            return null;
        }

        return [
            this.normalizeAmount(amount),
            this.getIncomeRisk(income),
            this.getTimeRisk(time),
            this.getLocationRisk(location),
            this.getMerchantRisk(merchantTypes),
            this.getTransactionModeRisk(transactionMode)
        ];
    }

    validateInputs(amount, income, time, location, merchantTypes, transactionMode) {
        if (!amount || !income || !time || !location || merchantTypes.length === 0 || !transactionMode) {
            this.showAlert('Please fill in all fields', 'warning');
            return false;
        }
        return true;
    }

    normalizeAmount(amount) {
        // Convert to monthly spending ratio based on income levels
        const incomeMap = {
            low: 25000,    // ≤₹25k monthly
            middle: 50000, // ₹25k-50k monthly
            upper: 100000  // >₹50k monthly
        };

        const income = document.getElementById('income')?.value || 'middle';
        const monthlyIncome = incomeMap[income];
        
        // Calculate spending ratio (amount as percentage of monthly income)
        const spendingRatio = amount / monthlyIncome;
        
        // Progressive risk scaling:
        // 0-20% of income: low risk (0-0.3)
        // 20-40% of income: medium risk (0.3-0.7)
        // >40% of income: high risk (0.7-1.0)
        if (spendingRatio <= 0.2) {
            return (spendingRatio / 0.2) * 0.3;
        } else if (spendingRatio <= 0.4) {
            return 0.3 + ((spendingRatio - 0.2) / 0.2) * 0.4;
        } else {
            return Math.min(1, 0.7 + ((spendingRatio - 0.4) / 0.6) * 0.3);
        }
    }

    getTimeRisk(time) {
        const hour = parseInt(time.split(':')[0]);
        
        // High-risk hours (10 PM - 5 AM): 0.7-0.9
        if (hour >= 22 || hour <= 5) {
            return 0.7 + (Math.random() * 0.2);
        }
        
        // Medium-risk hours (8 PM - 10 PM): 0.4-0.7
        if (hour >= 20) {
            return 0.4 + (Math.random() * 0.3);
        }
        
        // Low-risk business hours (9 AM - 6 PM): 0.1-0.3
        if (hour >= 9 && hour <= 18) {
            return 0.1 + (Math.random() * 0.2);
        }
        
        // Other hours: 0.3-0.5
        return 0.3 + (Math.random() * 0.2);
    }

    calculateRiskScore(features) {
        // Base weights for different factors
        const weights = [0.35, 0.25, 0.15, 0.1, 0.1, 0.05];
        let baseScore = features.reduce((sum, feature, i) => sum + feature * weights[i], 0);
        
        const [amount, income, time, location, merchant, payment] = features;
        
        // Risk multipliers for specific combinations
        let riskMultiplier = 1.0;
        
        // High amount relative to income level
        if (amount > 0.4 && income > 0.5) {
            riskMultiplier += 0.3;
        }
        
        // Late night + high amount
        if (time > 0.6 && amount > 0.3) {
            riskMultiplier += 0.25;
        }
        
        // High-risk location + high amount
        if (location > 0.6 && amount > 0.4) {
            riskMultiplier += 0.2;
        }
        
        // Multiple high-risk factors (threshold lowered)
        const highRiskCount = features.filter(f => f > 0.5).length;
        if (highRiskCount >= 2) {
            riskMultiplier += 0.2 * (highRiskCount - 1);
        }
        
        // Unusual payment method for amount
        if (payment > 0.6 && amount > 0.5) {
            riskMultiplier += 0.15;
        }
        
        // Apply multiplier and ensure result is between 0 and 1
        return Math.min(1, Math.max(0, baseScore * riskMultiplier));
    }

    getMerchantRisk(types) {
        const riskLevels = {
            // Essential - Low to Medium Risk
            groceries: 0.2, utilities: 0.3, medical: 0.3, education: 0.3, rent: 0.3,
            
            // Shopping - Medium to High Risk
            electronics: 0.6, fashion: 0.5, furniture: 0.5, beauty: 0.4,
            jewelry: 0.8, // Luxury items
            
            // Services - Variable Risk
            travel: 0.6, entertainment: 0.5, dining: 0.4, salon: 0.4, repair: 0.5,
            
            // Financial - Higher Risk
            investment: 0.8, insurance: 0.6, transfer: 0.7, loan: 0.7,
            crypto: 0.9, // Highest risk
            
            // Business - High Risk
            b2b: 0.7, wholesale: 0.7, software: 0.6, consulting: 0.6, marketing: 0.6
        };

        // Calculate weighted risk based on transaction types
        const baseRisk = types.reduce((sum, type) => sum + (riskLevels[type] || 0.5), 0) / types.length;
        
        // Add risk for multiple transactions
        const multipleTypesMultiplier = 1 + (types.length - 1) * 0.15;
        
        // Add risk for mixing certain categories
        const hasFinancial = types.some(t => ['investment', 'crypto', 'transfer', 'loan'].includes(t));
        const hasLuxury = types.some(t => ['jewelry', 'electronics'].includes(t));
        
        let categoryRiskBonus = 0;
        if (hasFinancial && hasLuxury) {
            categoryRiskBonus = 0.2;
        }
        
        return Math.min(1, baseRisk * multipleTypesMultiplier + categoryRiskBonus);
    }

    updateConfidenceChart(score) {
        const color = score >= 70 ? '#EF5350' : score >= 30 ? '#FFA726' : '#4CAF50';
        
        const update = {
            value: score,
            'gauge.threshold.value': score,
            'gauge.threshold.line.color': color
        };
        
        const layout = {
            annotations: [{
                text: score >= 70 ? 'High Risk' : score >= 30 ? 'Medium Risk' : 'Low Risk',
                x: 0.5,
                y: 0.85,
                font: {
                    size: 20,
                    color: color
                },
                showarrow: false,
                xref: 'paper',
                yref: 'paper'
            }]
        };

        Plotly.update('confidenceChart', update, layout);
    }

    showRiskAssessment(score) {
        let message, type;
        if (score >= 70) {
            message = `⚠️ High Risk (${score.toFixed(1)}%): This transaction shows significant risk factors.`;
            type = 'danger';
        } else if (score >= 30) {
            message = `⚠️ Medium Risk (${score.toFixed(1)}%): Exercise caution with this transaction.`;
            type = 'warning';
        } else {
            message = `✅ Low Risk (${score.toFixed(1)}%): This transaction appears safe.`;
            type = 'success';
        }
        this.showAlert(message, type);
    }

    getIncomeRisk(income) {
        const risks = { low: 0.8, middle: 0.4, upper: 0.2 };
        return risks[income] || 0.5;
    }

    getLocationRisk(location) {
        const majorCities = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'kolkata'];
        return majorCities.includes(location) ? 0.3 : 0.7;
    }

    getTransactionModeRisk(mode) {
        const risks = {
            upi: 0.3,
            debit: 0.4,
            credit: 0.6,
            netbanking: 0.5,
            wallet: 0.4
        };
        return risks[mode] || 0.5;
    }

    showAlert(message, type) {
        const alert = document.getElementById('result');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alert.style.display = 'block';
    }

    updateTimeDisplay() {
        const timeInput = document.getElementById('time');
        const timeDisplay = document.getElementById('timeDisplay');
        const hour = parseInt(timeInput.value.split(':')[0]);
        
        let riskLevel;
        if (hour >= 23 || hour <= 4) {
            riskLevel = 'High risk hours (Late night)';
        } else if (hour >= 9 && hour <= 17) {
            riskLevel = 'Low risk hours (Business hours)';
        } else {
            riskLevel = 'Medium risk hours';
        }
        
        timeDisplay.textContent = riskLevel;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.fraudDetectionSystem = new FraudDetectionSystem();
});
