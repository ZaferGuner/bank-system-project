const API_BASE = 'http://localhost:8000/api/v1';
let currentUser = null;
let authToken = null;
let userAccounts = [];
let autoScroll = true;
let logCounter = 0;
let apiAutoScroll = true;
let apiLogCounter = 0;
let pendingTransfer = null;
let transactionHistory = {};
let currentLanguage = 'tr';
let petData = null;
let lastPetAction = 0;

const TRANSLATIONS = {
    tr: {
        // UI Metinleri
        welcomeText: "Hoş Geldiniz",
        balance: "Bakiyeniz",
        services: "Hizmetler", 
        accounts: "Hesaplarım",
        recentTransactions: "Son İşlemler",
        
        // Navigasyon
        sendMoney: "Para Gönder",
        myTransactions: "İşlemlerim",
        qrPayment: "QR Ödeme",
        payBill: "Fatura Öde",
        exchangeRates: "Döviz Kurları",
        investments: "Yatırımlarım",
        creditCard: "Kredi Kartı",
        support: "Destek",
        
        // Modal Başlıkları
        moneyTransfer: "Para Transferi",
        transferConfirmation: "Transfer Onayı",
        qrCodePayment: "QR Kod ile Ödeme",
        billPayment: "Fatura Ödeme",
        exchangeRatesTitle: "Döviz Kurları",
        investmentPortfolio: "Yatırım Portföyü",
        myCreditCards: "Kredi Kartlarım",
        customerSupport: "Müşteri Destek",
        
        // Form Etiketleri
        senderAccount: "Gönderen Hesap",
        recipient: "Alıcı",
        amount: "Tutar (TL)",
        description: "Açıklama",
        send: "Gönder",
        cancel: "İptal",
        confirm: "Onayla",
        ok: "Tamam",
        
        // Log Mesajları
        systemStarted: "Banka sistemi başlatılıyor...",
        demoMode: "Sistem başlatıldı - Demo modunda çalışıyor",
        userLoaded: "hesabı yüklendi",
        profileFetched: "Kullanıcı profili alındı",
        accountsLoaded: "Hesap listesi alındı",
        logSystemStarted: "Log sistemi başlatıldı",
        autoScrollActive: "Otomatik kaydırma aktif",
        apiMonitoringStarted: "API monitoring başlatıldı",
        rateLimitingActive: "Rate limiting kontrolleri aktif",
        cacheCleared: "Cache temizlendi",
        userSwitchRequest: "Kullanıcı değiştirme isteği",
        newUserAccountsFetched: "Yeni kullanıcı hesapları alındı",
        accountDataLoaded: "Hesap verileri yüklendi",
        databaseConnectionChecked: "Veritabanı bağlantısı kontrol edildi",
        systemPerformanceNormal: "Sistem performansı normal",
        memoryUsage: "Bellek kullanımı",
        activeUsers: "Aktif kullanıcı sayısı",
        backupCompleted: "Backup işlemi tamamlandı",
        sslCertificatesRenewed: "SSL sertifikaları yenilendi",
        sessionCleanup: "Session cleanup yapıldı",
        systemHealthCheck: "Sistem sağlık kontrolü",
        systemStats: "Sistem istatistikleri",
        auditLogCreated: "Audit kaydı oluşturuldu",
        sessionValidated: "Oturum doğrulandı",
        cacheRefreshed: "Cache yenilendi",
        logFilesRotated: "Log dosyaları döndürüldü",
        systemMetricsFetched: "Sistem metrikleri alındı",
        logsCleared: "Loglar temizlendi",
        autoScrollEnabled: "Otomatik kaydırma açıldı",
        autoScrollDisabled: "Otomatik kaydırma kapatıldı",
        autoScrollPaused: "Kaydırma Durduruldu",
        apiLogsCleared: "API logları temizlendi",
        apiAutoScrollEnabled: "API otomatik kaydırma açıldı",
        apiAutoScrollDisabled: "API otomatik kaydırma kapatıldı",
        userSwitched: "Kullanıcı değiştirildi",
        transferFormOpened: "Para transfer formu açıldı",
        transferFormData: "Transfer formu verileri alındı",
        transactionHistoryQueried: "İşlem geçmişi sorgulandı",
        transactionHistoryDisplayed: "İşlem geçmişi görüntülendi",
        transactionAdded: "Yeni işlem son işlemler listesine eklendi",
        
        // Hesap Tipleri
        checking: "Vadesiz Hesap",
        savings: "Vadeli Hesap", 
        business: "Ticari Hesap",
        
        // İşlem Tipleri
        incomingTransfer: "Gelen Transfer",
        outgoingTransfer: "Giden Transfer",
        
        // Hata/Başarı Mesajları
        error: "Hata",
        success: "Başarılı",
        insufficientBalance: "Yetersiz bakiye",
        senderAccountNotFound: "Gönderen hesap bulunamadı",
        
        // Diğer
        selectAccount: "Hesap seçin",
        selectRecipient: "Alıcı seçin",
        noTransactions: "Henüz işlem geçmişi bulunmuyor",
        balanceAfterTransaction: "İşlem sonrası bakiye",
        
        // Evcil Hayvan
        petLevel: "Seviye",
        petVeryHappy: "😍 Çok Mutlu",
        petHappy: "😊 Mutlu",
        petNeutral: "😐 Normal",
        petSad: "😢 Üzgün",
        petVerySad: "😭 Çok Üzgün",
        petLevelUp: "🎉 Tebrikler! Evcil hayvanın seviye atladı!",
        petPositiveMessage1: "Bu ay harika tasarruf ediyorsun! 🎉",
        petPositiveMessage2: "Finansal hedeflerine ulaşmaya yaklaşıyorsun! 💪",
        petPositiveMessage3: "Bu harcama alışkanlıkları süper! 🌟",
        petNegativeMessage1: "Bu ay biraz fazla harcama yaptın 😔",
        petNegativeMessage2: "Tasarruf etmeyi unutma! 💸",
        petNegativeMessage3: "Bütçeni tekrar gözden geçirmeli 📊",
        
        // Finansal Evcil Hayvan bölüm başlığı
        financialPet: "Finansal Evcil Hayvan"
    },
    en: {
        // UI Texts
        welcomeText: "Welcome",
        balance: "Your Balance",
        services: "Services",
        accounts: "My Accounts", 
        recentTransactions: "Recent Transactions",
        
        // Navigation
        sendMoney: "Send Money",
        myTransactions: "My Transactions",
        qrPayment: "QR Payment",
        payBill: "Pay Bill",
        exchangeRates: "Exchange Rates",
        investments: "My Investments",
        creditCard: "Credit Card",
        support: "Support",
        
        // Modal Titles
        moneyTransfer: "Money Transfer",
        transferConfirmation: "Transfer Confirmation",
        qrCodePayment: "QR Code Payment",
        billPayment: "Bill Payment",
        exchangeRatesTitle: "Exchange Rates",
        investmentPortfolio: "Investment Portfolio",
        myCreditCards: "My Credit Cards",
        customerSupport: "Customer Support",
        
        // Form Labels
        senderAccount: "Sender Account",
        recipient: "Recipient",
        amount: "Amount (TL)",
        description: "Description",
        send: "Send",
        cancel: "Cancel",
        confirm: "Confirm",
        ok: "OK",
        
        // Log Messages
        systemStarted: "Bank system starting...",
        demoMode: "System started - Running in demo mode",
        userLoaded: "account loaded",
        profileFetched: "User profile fetched",
        accountsLoaded: "Account list loaded",
        logSystemStarted: "Log system started",
        autoScrollActive: "Auto scroll active",
        apiMonitoringStarted: "API monitoring started",
        rateLimitingActive: "Rate limiting controls active",
        cacheCleared: "Cache cleared",
        userSwitchRequest: "User switch request",
        newUserAccountsFetched: "New user accounts fetched",
        accountDataLoaded: "Account data loaded",
        databaseConnectionChecked: "Database connection checked",
        systemPerformanceNormal: "System performance normal",
        memoryUsage: "Memory usage",
        activeUsers: "Active users count",
        backupCompleted: "Backup operation completed",
        sslCertificatesRenewed: "SSL certificates renewed",
        sessionCleanup: "Session cleanup performed",
        systemHealthCheck: "System health check",
        systemStats: "System statistics",
        auditLogCreated: "Audit log created",
        sessionValidated: "Session validated",
        cacheRefreshed: "Cache refreshed",
        logFilesRotated: "Log files rotated",
        systemMetricsFetched: "System metrics fetched",
        logsCleared: "Logs cleared",
        autoScrollEnabled: "Auto scroll enabled",
        autoScrollDisabled: "Auto scroll disabled",
        autoScrollPaused: "Scrolling Paused",
        apiLogsCleared: "API logs cleared",
        apiAutoScrollEnabled: "API auto scroll enabled",
        apiAutoScrollDisabled: "API auto scroll disabled",
        userSwitched: "User switched",
        transferFormOpened: "Money transfer form opened",
        transferFormData: "Transfer form data fetched",
        transactionHistoryQueried: "Transaction history queried",
        transactionHistoryDisplayed: "Transaction history displayed",
        transactionAdded: "New transaction added to recent transactions list",
        
        // Account Types
        checking: "Checking Account",
        savings: "Savings Account",
        business: "Business Account",
        
        // Transaction Types
        incomingTransfer: "Incoming Transfer",
        outgoingTransfer: "Outgoing Transfer",
        
        // Error/Success Messages
        error: "Error",
        success: "Success",
        insufficientBalance: "Insufficient balance",
        senderAccountNotFound: "Sender account not found",
        
        // Others
        selectAccount: "Select account",
        selectRecipient: "Select recipient",
        noTransactions: "No transaction history yet",
        balanceAfterTransaction: "Balance after transaction",
        
        // Pet
        petLevel: "Level",
        petVeryHappy: "😍 Very Happy",
        petHappy: "😊 Happy",
        petNeutral: "😐 Neutral",
        petSad: "😢 Sad",
        petVerySad: "😭 Very Sad",
        petLevelUp: "🎉 Congratulations! Your pet leveled up!",
        petPositiveMessage1: "You're saving great this month! 🎉",
        petPositiveMessage2: "You're getting closer to your financial goals! 💪",
        petPositiveMessage3: "These spending habits are super! 🌟",
        petNegativeMessage1: "You spent a bit too much this month 😔",
        petNegativeMessage2: "Don't forget to save! 💸",
        petNegativeMessage3: "You should review your budget 📊",
        
        // Financial Pet section header
        financialPet: "Financial Pet"
    }
};

const DEMO_USERS = {
    a: {
        id: 1,
        username: 'user_a',
        first_name: 'A',
        last_name: '',
        token: 'demo_token_a'
    },
    b: {
        id: 2,
        username: 'user_b',
        first_name: 'B',
        last_name: '',
        token: 'demo_token_b'
    }
};

const DEMO_ACCOUNTS = {
    a: [
        {
            id: 1,
            account_number: 'TR1234567890123456',
            account_type: 'checking',
            balance: 15750.50,
            currency: 'TRY'
        }
    ],
    b: [
        {
            id: 2,
            account_number: 'TR9876543210987654',
            account_type: 'checking',
            balance: 8920.25,
            currency: 'TRY'
        }
    ]
};

const DEMO_PETS = {
    a: {
        name: 'Minka',
        character: '🐱',
        level: 3,
        experience: 75,
        maxExperience: 100,
        health: 85,
        maxHealth: 100,
        happiness: 80,
        maxHappiness: 100,
        mood: 'happy',
        lastFed: Date.now() - 7200000, // 2 saat 
        achievements: ['firstSavings', 'weekActive'],
        financialScore: 75,
        message: 'petPositiveMessage1'
    },
    b: {
        name: 'Buddy',
        character: '🐶',
        level: 2,
        experience: 45,
        maxExperience: 100,
        health: 70,
        maxHealth: 100,
        happiness: 60,
        maxHappiness: 100,
        mood: 'neutral',
        lastFed: Date.now() - 14400000, // 4 saat 
        achievements: ['firstSavings'],
        financialScore: 55,
        message: 'petNegativeMessage2'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    startLogSystem();
    updateTime();
    setInterval(updateTime, 1000);
    initializeScrollIndicators();
});

function initializeApp() {
    // İşlem geçmişi başlat
    initializeTransactionHistory();
    
    currentUser = DEMO_USERS.a;
    authToken = currentUser.token;
    userAccounts = DEMO_ACCOUNTS.a;
    
    // Evcil hayvan sistemi başlat
    initializePetSystem();
    
    // Periyodik güncellemeler başlat
    startPeriodicUpdates();
    
    updateUI();
    updateLanguageButton();
    logMessage('system', t('demoMode'));
    logMessage('success', `${currentUser.first_name} ${currentUser.last_name} ${t('userLoaded')}`);
    
    // Sahte API çağrıları simüle et
    setTimeout(() => {
        logApiRequest('GET', '/api/v1/user/profile', 200, t('profileFetched'));
        setTimeout(() => {
            logApiRequest('GET', '/api/v1/accounts', 200, t('accountsLoaded'));
            logApiRequest('GET', '/api/v1/pet/status', 200, 'Evcil hayvan durumu alındı');
        }, 500);
    }, 1000);
}

function startPeriodicUpdates() {
    // Genel sistem durumunu her 30 saniyede kontrol et
    setInterval(() => {
        logMessage('system', 'Sistem sağlık kontrolü tamamlandı');
        logApiRequest('GET', '/api/v1/system/health', 200, 'Sistem durumu: Normal');
    }, 30000);
    
    logMessage('system', 'Periyodik güncellemeler başlatıldı');
}

function toggleSidebar() {
    const sidebar = document.getElementById('navigationSidebar');
    const icon = document.getElementById('sidebarToggleIcon');
    
    sidebar.classList.toggle('collapsed');
}

function t(key) {
    return TRANSLATIONS[currentLanguage][key] || key;
}

function toggleLanguage() {
    // Dili değiştir
    currentLanguage = currentLanguage === 'tr' ? 'en' : 'tr';
    
    // Buton görünümünü güncelle
    updateLanguageButton();
    
    // UI'yi güncelle
    updateLanguage();
    
    logMessage('system', currentLanguage === 'tr' ? 'Dil Türkçe olarak değiştirildi' : 'Language changed to English');
}

function updateLanguageButton() {
    const languageText = document.getElementById('languageText');
    
    if (currentLanguage === 'tr') {
        languageText.textContent = 'TR';
    } else {
        languageText.textContent = 'EN';
    }
}

function updateLanguage() {
    // UI metinlerini güncelle
    const welcomeText = document.getElementById('welcomeText');
    if (welcomeText) {
        welcomeText.textContent = `${t('welcomeText')} ${currentUser.first_name} ${currentUser.last_name}`;
    }
    
    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
        const icon = navBrand.querySelector('i');
        navBrand.innerHTML = '';
        navBrand.appendChild(icon);
        navBrand.innerHTML += currentLanguage === 'tr' ? ' Banka' : ' Bank';
    }
    
    document.title = currentLanguage === 'tr' ? 'Banka Sistemi - Demo' : 'Bank System - Demo';
    
    // Balance card başlığını güncelle
    const balanceCardTitle = document.querySelector('.balance-card h3');
    if (balanceCardTitle) {
        balanceCardTitle.textContent = t('balance');
    }
    
    const sidebarTitle = document.querySelector('.navigation-sidebar h3');
    if (sidebarTitle) {
        sidebarTitle.textContent = t('services');
    }
    
    const accountsTitle = document.querySelector('.account-cards h3');
    if (accountsTitle) {
        accountsTitle.textContent = t('accounts');
    }
    
    // Navigation butonlarını güncelle
    updateNavigationButtons();
    
    const transactionsTitle = document.querySelector('#transactionsSection h3');
    if (transactionsTitle) {
        transactionsTitle.textContent = t('recentTransactions');
    }
    
    // Hesap tiplerini güncelle
    displayAccounts();
    
    const transactionsSection = document.getElementById('transactionsSection');
    if (!transactionsSection.classList.contains('hidden')) {
        refreshTransactionsList();
    }
    
    // Evcil hayvan ekranını güncelle
    updatePetDisplay();
    
    // Data-translate attribute'lu elemanları güncelle
    const translateElements = document.querySelectorAll('[data-translate]');
    translateElements.forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = t(key);
    });
    
    // Buton metinlerini güncelle
    updateButtonTexts();
}

function updateButtonTexts() {
    const autoScrollBtn = document.getElementById('autoScrollBtn');
    const apiAutoScrollBtn = document.getElementById('apiAutoScrollBtn');
    
    if (autoScrollBtn) {
        if (autoScrollBtn.classList.contains('active')) {
            autoScrollBtn.innerHTML = `<i class="fas fa-arrow-down"></i> ${currentLanguage === 'tr' ? 'Otomatik Kaydırma' : 'Auto Scroll'}`;
        } else {
            autoScrollBtn.innerHTML = `<i class="fas fa-pause"></i> ${t('autoScrollPaused')}`;
        }
    }
    
    if (apiAutoScrollBtn) {
        if (apiAutoScrollBtn.classList.contains('active')) {
            apiAutoScrollBtn.innerHTML = `<i class="fas fa-arrow-down"></i> ${currentLanguage === 'tr' ? 'Otomatik Kaydırma' : 'Auto Scroll'}`;
        } else {
            apiAutoScrollBtn.innerHTML = `<i class="fas fa-pause"></i> ${t('autoScrollPaused')}`;
        }
    }
    
    const clearButtons = document.querySelectorAll('.btn-clear');
    clearButtons.forEach(btn => {
        btn.innerHTML = `<i class="fas fa-trash"></i> ${currentLanguage === 'tr' ? 'Temizle' : 'Clear'}`;
    });
}

function updateNavigationButtons() {
    const buttons = [
        { selector: '[onclick="showTransferModal()"]', key: 'sendMoney' },
        { selector: '[onclick="showTransactions()"]', key: 'myTransactions' },
        { selector: '[onclick="showQRPayment()"]', key: 'qrPayment' },
        { selector: '[onclick="showBillPayment()"]', key: 'payBill' },
        { selector: '[onclick="showCreditCard()"]', key: 'creditCard' },
        { selector: '[onclick="showSupport()"]', key: 'support' }
    ];
    
    buttons.forEach(button => {
        const element = document.querySelector(button.selector + ' span');
        if (element) {
            element.textContent = t(button.key);
        }
    });
}



function updateUI() {
    document.getElementById('welcomeText').textContent = `${t('welcomeText')} ${currentUser.first_name} ${currentUser.last_name}`;
    displayAccounts();
    updateTotalBalance();
    populateAccountSelects();
    updateLanguage();
}

function switchUser() {
    const selectedUser = document.getElementById('userSelect').value;
    const previousUser = currentUser.first_name;
    
    logApiRequest('POST', '/api/v1/auth/switch-user', 200, t('userSwitchRequest'));
    
    currentUser = DEMO_USERS[selectedUser];
    authToken = currentUser.token;
    userAccounts = DEMO_ACCOUNTS[selectedUser];
    
    petData = { ...DEMO_PETS[selectedUser] };
    updatePetDisplay();
    
    updateUI();
    
    const transactionsSection = document.getElementById('transactionsSection');
    if (!transactionsSection.classList.contains('hidden')) {
        refreshTransactionsList();
        logMessage('system', 'Yeni kullanıcının işlem geçmişi yüklendi');
    }
    
    logMessage('warning', `${t('userSwitched')}: ${previousUser} → ${currentUser.first_name} ${currentUser.last_name}`);
    logMessage('system', `${t('accountDataLoaded')} - ${t('balance')}: ${formatCurrency(userAccounts[0].balance)} TL`);
    logMessage('system', `🐾 Evcil hayvan güncellendi: ${petData.name} (${t('petLevel')} ${petData.level})`);
    
    setTimeout(() => {
        logApiRequest('GET', '/api/v1/accounts', 200, t('newUserAccountsFetched'));
        logApiRequest('GET', '/api/v1/pet/status', 200, 'Yeni kullanıcının evcil hayvan durumu alındı');
    }, 300);
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('tr-TR');
    const dateString = now.toLocaleDateString('tr-TR');
    document.getElementById('currentTime').textContent = `${dateString} ${timeString}`;
}

function displayAccounts() {
    const accountsList = document.getElementById('accountsList');
    accountsList.innerHTML = '';

    userAccounts.forEach(account => {
        const accountCard = document.createElement('div');
        accountCard.className = 'account-card';
        accountCard.innerHTML = `
            <div class="account-number">${account.account_number}</div>
            <div class="account-type">${getAccountTypeName(account.account_type)}</div>
            <div class="account-balance">${formatCurrency(account.balance)} ${account.currency}</div>
        `;
        accountsList.appendChild(accountCard);
    });
}

function updateTotalBalance() {
    const total = userAccounts.reduce((sum, account) => sum + parseFloat(account.balance), 0);
    document.getElementById('totalBalance').textContent = `${formatCurrency(total)} TL`;
}

function populateAccountSelects() {
    const fromSelect = document.getElementById('fromAccount');
    const toSelect = document.getElementById('toAccount');
    
    fromSelect.innerHTML = `<option value="">${t('selectAccount')}</option>`;
    toSelect.innerHTML = `<option value="">${t('selectRecipient')}</option>`;
    
    userAccounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.account_number;
        option.textContent = `${account.account_number} (${formatCurrency(account.balance)} TL)`;
        fromSelect.appendChild(option);
    });
    
    Object.keys(DEMO_USERS).forEach(userKey => {
        if (userKey !== document.getElementById('userSelect').value) {
            const otherUser = DEMO_USERS[userKey];
            const otherAccounts = DEMO_ACCOUNTS[userKey];
            
            otherAccounts.forEach(account => {
                const option = document.createElement('option');
                option.value = account.account_number;
                option.textContent = `${otherUser.first_name} ${otherUser.last_name} (${account.account_number})`;
                toSelect.appendChild(option);
            });
        }
    });
}

function getAccountTypeName(type) {
    return t(type) || type;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function showTransferModal() {
    document.getElementById('transferModal').classList.add('active');
    logMessage('system', t('transferFormOpened'));
    logApiRequest('GET', '/api/v1/accounts/transfer-form', 200, t('transferFormData'));
}

function closeTransferModal() {
    document.getElementById('transferModal').classList.remove('active');
    document.querySelector('#transferModal form').reset();
}

async function transfer(event) {
    event.preventDefault();
    
    const fromAccountNumber = document.getElementById('fromAccount').value;
    const toAccountNumber = document.getElementById('toAccount').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);
    const description = document.getElementById('transferDescription').value || 'Açıklama yok';
    
    const fromAccount = userAccounts.find(acc => acc.account_number === fromAccountNumber);
    
    if (!fromAccount) {
        logMessage('error', t('senderAccountNotFound'));
        showMessage(t('error'), t('senderAccountNotFound'));
        return;
    }
    
    if (fromAccount.balance < amount) {
        logMessage('error', `${t('insufficientBalance')} - ${currentLanguage === 'tr' ? 'Mevcut' : 'Available'}: ${formatCurrency(fromAccount.balance)} TL`);
        showMessage(t('error'), t('insufficientBalance'));
        return;
    }
    
    // Alıcı hesap adını bul
    const toAccountName = getAccountDisplayName(toAccountNumber);
    
    // Onay modalını göster
    pendingTransfer = {
        fromAccountNumber,
        toAccountNumber,
        amount,
        description,
        fromAccount
    };
    
    document.getElementById('confirmFromAccount').textContent = fromAccountNumber;
    document.getElementById('confirmToAccount').textContent = toAccountName;
    document.getElementById('confirmAmount').textContent = `${formatCurrency(amount)} TL`;
    document.getElementById('confirmDescription').textContent = description;
    
    closeTransferModal();
    document.getElementById('confirmModal').classList.add('active');
}

function refreshTransactionsList() {
    const transactionsList = document.getElementById('transactionsList');
    
    const currentUserKey = document.getElementById('userSelect').value;
    const userTransactions = transactionHistory[currentUserKey] || [];
    
    transactionsList.innerHTML = '';
    
    if (userTransactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="no-transactions">
                <i class="fas fa-inbox"></i>
                <p>${t('noTransactions')}</p>
            </div>
        `;
    } else {
        userTransactions.forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.className = `transaction-item ${transaction.type}`;
            
            const isIncoming = transaction.type === 'transfer_in';
            const amountClass = isIncoming ? 'amount-positive' : 'amount-negative';
            const icon = isIncoming ? 'fa-arrow-down' : 'fa-arrow-up';
            const typeText = isIncoming ? t('incomingTransfer') : t('outgoingTransfer');
            
            transactionElement.innerHTML = `
                <div class="transaction-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-header">
                        <span class="transaction-type">${typeText}</span>
                        <span class="transaction-amount ${amountClass}">${formatCurrency(Math.abs(transaction.amount))} TL</span>
                    </div>
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-info">
                        <span class="transaction-date">${transaction.date.toLocaleString('tr-TR')}</span>
                        <span class="transaction-account">
                            ${isIncoming ? (currentLanguage === 'tr' ? 'Gönderen: ' : 'From: ') + (transaction.from_account || (currentLanguage === 'tr' ? 'Bilinmiyor' : 'Unknown')) : (currentLanguage === 'tr' ? 'Alıcı: ' : 'To: ') + (transaction.to_account || (currentLanguage === 'tr' ? 'Bilinmiyor' : 'Unknown'))}
                        </span>
                    </div>
                    <div class="transaction-balance">
                        ${t('balanceAfterTransaction')}: ${formatCurrency(transaction.balance_after)} TL
                    </div>
                </div>
            `;
            
            if (transaction.id === userTransactions[0].id && userTransactions.length > 1) {
                transactionElement.style.animation = 'newTransactionSlide 0.5s ease-out';
            }
            
            transactionsList.appendChild(transactionElement);
        });
    }
}

function showTransactions() {
    const transactionsSection = document.getElementById('transactionsSection');
    
    logApiRequest('GET', `/api/v1/accounts/${userAccounts[0].account_number}/transactions`, 200, t('transactionHistoryQueried'));
    
    refreshTransactionsList();
    
    transactionsSection.classList.remove('hidden');
    
    const currentUserKey = document.getElementById('userSelect').value;
    const userTransactions = transactionHistory[currentUserKey] || [];
    logMessage('system', `${t('transactionHistoryDisplayed')} - ${userTransactions.length} ${currentLanguage === 'tr' ? 'işlem listelendi' : 'transactions listed'}`);
}

function hideTransactions() {
    document.getElementById('transactionsSection').classList.add('hidden');
}

function initializeTransactionHistory() {
    transactionHistory.a = [
        {
            id: 1,
            date: new Date('2024-01-15T14:30:00'),
            type: 'transfer_out',
            amount: -250.00,
            description: 'Elektrik faturası',
            to_account: 'TEDAŞ',
            balance_after: 15750.50
        },
        {
            id: 2,
            date: new Date('2024-01-14T09:15:00'),
            type: 'transfer_in',
            amount: 3000.00,
            description: 'Maaş ödemesi',
            from_account: 'ABC Şirket',
            balance_after: 16000.50
        },
        {
            id: 3,
            date: new Date('2024-01-13T16:45:00'),
            type: 'transfer_out',
            amount: -150.00,
            description: 'Market alışverişi',
            to_account: 'TR9876543210987654',
            balance_after: 13000.50
        },
        {
            id: 4,
            date: new Date('2024-01-12T11:20:00'),
            type: 'transfer_in',
            amount: 500.00,
            description: 'Arkadaştan gelen para',
            from_account: 'TR5555666677778888',
            balance_after: 13150.50
        },
        {
            id: 5,
            date: new Date('2024-01-11T08:30:00'),
            type: 'transfer_out',
            amount: -75.50,
            description: 'İnternet faturası',
            to_account: 'Türk Telekom',
            balance_after: 12650.50
        },
        {
            id: 6,
            date: new Date('2024-01-10T15:00:00'),
            type: 'transfer_in',
            amount: 1000.00,
            description: 'Freelance proje ödemesi',
            from_account: 'XYZ Ajans',
            balance_after: 12726.00
        }
    ];

    transactionHistory.b = [   
        {
            id: 1,
            date: new Date('2024-01-15T10:30:00'),
            type: 'transfer_out',
            amount: -200.00,
            description: 'Kira ödemesi',
            to_account: 'Emlak Ofisi',
            balance_after: 8920.25
        },
        {
            id: 2,
            date: new Date('2024-01-14T14:15:00'),
            type: 'transfer_in',
            amount: 2500.00,
            description: 'Maaş ödemesi',
            from_account: 'DEF Şirket',
            balance_after: 9120.25
        },
        {
            id: 3,
            date: new Date('2024-01-13T19:30:00'),
            type: 'transfer_out',
            amount: -125.75,
            description: 'Yemek siparişi',
            to_account: 'Restoran ABC',
            balance_after: 6620.25
        },
        {
            id: 4,
            date: new Date('2024-01-12T12:45:00'),
            type: 'transfer_in',
            amount: 750.00,
            description: 'Satış geliri',
            from_account: 'Online Mağaza',
            balance_after: 6746.00
        }
    ];
}

function addTransaction(userKey, type, amount, description, otherAccount, currentBalance) {
    if (!transactionHistory[userKey]) {
        transactionHistory[userKey] = [];
    }
    
    const newTransaction = {
        id: transactionHistory[userKey].length + 1,
        date: new Date(),
        type: type,
        amount: amount,
        description: description,
        balance_after: currentBalance
    };
    
    if (type === 'transfer_in') {
        newTransaction.from_account = otherAccount;
    } else {
        newTransaction.to_account = otherAccount;
    }
    
    transactionHistory[userKey].unshift(newTransaction);
    
    // 20'den fazla işlem varsa eski olanları temizle
    if (transactionHistory[userKey].length > 20) {
        transactionHistory[userKey] = transactionHistory[userKey].slice(0, 20);
    }
    
    // Eğer işlem geçmişi açıksa ve bu kullanıcının işlemiyse anında güncelle
    const transactionsSection = document.getElementById('transactionsSection');
    const currentUserKey = document.getElementById('userSelect').value;
    
    if (!transactionsSection.classList.contains('hidden') && userKey === currentUserKey) {
        setTimeout(() => {
            refreshTransactionsList();
            logMessage('success', `✨ ${t('transactionAdded')}`);
            
            // Kısa bir parlama efekti
            const transactionsList = document.getElementById('transactionsList');
            if (transactionsList.firstElementChild) {
                transactionsList.firstElementChild.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.6)';
                setTimeout(() => {
                    if (transactionsList.firstElementChild) {
                        transactionsList.firstElementChild.style.boxShadow = '';
                    }
                }, 1000);
            }
        }, 200);
    }
}

function showMessage(title, message) {
    document.getElementById('messageTitle').textContent = title;
    document.getElementById('messageText').textContent = message;
    document.getElementById('messageModal').classList.add('active');
    
    logMessage('system', `Kullanıcı mesajı: ${title} - ${message}`);
}

function closeMessageModal() {
    document.getElementById('messageModal').classList.remove('active');
}

function getAccountDisplayName(accountNumber) {
    // Kendi hesaplarından kontrol et
    const ownAccount = userAccounts.find(acc => acc.account_number === accountNumber);
    if (ownAccount) {
        return `${accountNumber} (${ownAccount.account_type})`;
    }
    
    // Diğer kullanıcıların hesaplarından kontrol et
    for (const userName in DEMO_ACCOUNTS) {
        const userAccount = DEMO_ACCOUNTS[userName].find(acc => acc.account_number === accountNumber);
        if (userAccount) {
            return `${accountNumber} (${userName} - ${userAccount.account_type})`;
        }
    }
    
    return accountNumber;
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
    pendingTransfer = null;
}

function confirmTransfer() {
    if (!pendingTransfer) return;
    
    const { fromAccountNumber, toAccountNumber, amount, description, fromAccount } = pendingTransfer;
    
    closeConfirmModal();
    
    logMessage('system', `Transfer başlatıldı: ${formatCurrency(amount)} TL`);
    logMessage('system', `Gönderen: ${fromAccountNumber} → Alıcı: ${toAccountNumber}`);
    
    // API isteği simüle et
    logApiRequest('POST', `/api/v1/accounts/${fromAccountNumber}/transfer`, 'PENDING', 'Transfer isteği gönderiliyor...');
    
    // Başarılı transfer simülasyonu
    setTimeout(() => {
        logApiRequest('POST', `/api/v1/accounts/${fromAccountNumber}/transfer`, 200, 'Transfer başarıyla tamamlandı');
        
        // Gönderen hesaptan para çek
        fromAccount.balance -= amount;
        const newBalance = fromAccount.balance;
        
        // Alıcı hesap bilgilerini bul
        const recipientKey = Object.keys(DEMO_ACCOUNTS).find(key => 
            DEMO_ACCOUNTS[key].some(acc => acc.account_number === toAccountNumber)
        );
        
        let recipientDisplayName = toAccountNumber;
        
        if (recipientKey) {
            const recipientAccount = DEMO_ACCOUNTS[recipientKey].find(acc => acc.account_number === toAccountNumber);
            if (recipientAccount) {
                recipientAccount.balance += amount;
                logMessage('success', `Alıcı hesaba ${formatCurrency(amount)} TL eklendi`);
                
                // Alıcı hesap sahibinin adını bul
                const recipientUser = DEMO_USERS[recipientKey];
                recipientDisplayName = `${recipientUser.first_name} ${recipientUser.last_name}`;
                
                // Alıcının işlem geçmişine de ekle
                addTransaction(recipientKey, 'transfer_in', amount, description, 
                    `${currentUser.first_name} ${currentUser.last_name}`, recipientAccount.balance);
            }
        }
        
        updateUI();
        
        // Gönderenin işlem geçmişine ekle (bu otomatik olarak listeyii güncelleyecek)
        const currentUserKey = document.getElementById('userSelect').value;
        addTransaction(currentUserKey, 'transfer_out', -amount, description, recipientDisplayName, newBalance);
        
        // Evcil hayvan tepkisi
        updatePetAfterTransaction(amount, 'transfer_out');
        
        logMessage('success', `Transfer tamamlandı! ${formatCurrency(amount)} TL gönderildi`);
        logMessage('system', `Yeni bakiye: ${formatCurrency(newBalance)} TL`);
        
        showMessage('Başarılı', `${formatCurrency(amount)} TL başarıyla gönderildi!`);
        
        // Güncellenmiş bakiye için API çağrısı
        setTimeout(() => {
            logApiRequest('GET', '/api/v1/accounts', 200, 'Güncellenmiş hesap bilgileri alındı');
        }, 500);
        
    }, 1500); // 1.5 saniye gecikme ile gerçekçi API simülasyonu
}

function startLogSystem() {
    logMessage('system', t('logSystemStarted'));
    logMessage('system', t('autoScrollActive'));
    
    // Periyodik sistem logları
    setInterval(() => {
        if (Math.random() < 0.3) {
            const randomLogs = [
                () => t('databaseConnectionChecked'),
                () => t('systemPerformanceNormal'),
                () => `${t('memoryUsage')}: %67`,
                () => `${t('activeUsers')}: 142`,
                () => t('cacheCleared'),
                () => t('backupCompleted'),
                () => t('sslCertificatesRenewed'),
                () => t('sessionCleanup'),
                () => t('rateLimitingActive')
            ];
            const randomLogFunc = randomLogs[Math.floor(Math.random() * randomLogs.length)];
            logMessage('system', randomLogFunc());
        }
    }, 8000);
    
    // Periyodik sahte API çağrıları
    setInterval(() => {
        if (Math.random() < 0.2) {
            const randomApis = [
                { method: 'GET', endpoint: '/api/v1/health', status: 200, desc: () => t('systemHealthCheck') },
                { method: 'GET', endpoint: '/api/v1/system/stats', status: 200, desc: () => t('systemStats') },
                { method: 'POST', endpoint: '/api/v1/audit/log', status: 201, desc: () => t('auditLogCreated') },
                { method: 'GET', endpoint: '/api/v1/user/session', status: 200, desc: () => t('sessionValidated') },
                { method: 'PUT', endpoint: '/api/v1/cache/refresh', status: 200, desc: () => t('cacheRefreshed') },
                { method: 'POST', endpoint: '/api/v1/logs/rotate', status: 200, desc: () => t('logFilesRotated') },
                { method: 'GET', endpoint: '/api/v1/metrics', status: 200, desc: () => t('systemMetricsFetched') }
            ];
            const randomApi = randomApis[Math.floor(Math.random() * randomApis.length)];
            logApiRequest(randomApi.method, randomApi.endpoint, randomApi.status, randomApi.desc());
        }
    }, 12000);
}

function logMessage(type, message) {
    const logsContent = document.getElementById('logsContent');
    const timestamp = new Date().toLocaleTimeString('tr-TR');
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.innerHTML = `
        <span class="log-timestamp">[${timestamp}]</span>
        <span class="log-message">${message}</span>
    `;
    
    logsContent.appendChild(logEntry);
    
    if (autoScroll) {
        logsContent.scrollTo({
            top: logsContent.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    logCounter++;
    if (logCounter > 100) {
        const firstEntry = logsContent.firstElementChild;
        if (firstEntry) {
            firstEntry.remove();
            logCounter--;
        }
    }
}

function logApiRequest(method, endpoint, statusCode, description) {
    const apiContent = document.getElementById('apiContent');
    const timestamp = new Date().toLocaleTimeString('tr-TR');
    
    let statusClass = 'system';
    let statusText = statusCode;
    
    if (statusCode === 'PENDING') {
        statusClass = 'warning';
        statusText = 'PENDING';
    } else if (statusCode >= 200 && statusCode < 300) {
        statusClass = 'success';
        statusText = `${statusCode} OK`;
    } else if (statusCode >= 400 && statusCode < 500) {
        statusClass = 'error';
        statusText = `${statusCode} ERROR`;
    } else if (statusCode >= 500) {
        statusClass = 'error';
        statusText = `${statusCode} SERVER ERROR`;
    }
    
    const apiEntry = document.createElement('div');
    apiEntry.className = `api-entry ${statusClass}`;
    apiEntry.innerHTML = `
        <span class="log-timestamp">[${timestamp}]</span>
        <span class="api-method">${method}</span>
        <span class="api-endpoint">${endpoint}</span>
        <span class="api-status">${statusText}</span>
        <span class="api-description">- ${description}</span>
    `;
    
    apiContent.appendChild(apiEntry);
    
    if (apiAutoScroll) {
        apiContent.scrollTo({
            top: apiContent.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    apiLogCounter++;
    if (apiLogCounter > 100) {
        const firstEntry = apiContent.firstElementChild;
        if (firstEntry) {
            firstEntry.remove();
            apiLogCounter--;
        }
    }
}

function clearLogs() {
    const logsContent = document.getElementById('logsContent');
    logsContent.innerHTML = '';
    logCounter = 0;
    logMessage('system', t('logsCleared'));
}

function toggleAutoScroll() {
    autoScroll = !autoScroll;
    const btn = document.getElementById('autoScrollBtn');
    
    if (autoScroll) {
        btn.classList.add('active');
        btn.innerHTML = `<i class="fas fa-arrow-down"></i> ${currentLanguage === 'tr' ? 'Otomatik Kaydırma' : 'Auto Scroll'}`;
        logMessage('system', t('autoScrollEnabled'));
    } else {
        btn.classList.remove('active');
        btn.innerHTML = `<i class="fas fa-pause"></i> ${t('autoScrollPaused')}`;
        logMessage('system', t('autoScrollDisabled'));
    }
}

function clearApiLogs() {
    const apiContent = document.getElementById('apiContent');
    apiContent.innerHTML = '';
    apiLogCounter = 0;
    logMessage('system', t('apiLogsCleared'));
}

function toggleApiAutoScroll() {
    apiAutoScroll = !apiAutoScroll;
    const btn = document.getElementById('apiAutoScrollBtn');
    
    if (apiAutoScroll) {
        btn.classList.add('active');
        btn.innerHTML = `<i class="fas fa-arrow-down"></i> ${currentLanguage === 'tr' ? 'Otomatik Kaydırma' : 'Auto Scroll'}`;
        logMessage('system', t('apiAutoScrollEnabled'));
    } else {
        btn.classList.remove('active');
        btn.innerHTML = `<i class="fas fa-pause"></i> ${t('autoScrollPaused')}`;
        logMessage('system', t('apiAutoScrollDisabled'));
    }
}

function initializeScrollIndicators() {
    const logsContent = document.getElementById('logsContent');
    const apiContent = document.getElementById('apiContent');
    
    if (!logsContent || !apiContent) {
        console.log('Log veya API content bulunamadı');
        return;
    }
    
    // Scroll event listeners
    logsContent.addEventListener('scroll', () => {
        console.log('Logs scroll event', logsContent.scrollTop, logsContent.scrollHeight);
    });
    
    apiContent.addEventListener('scroll', () => {
        console.log('API scroll event', apiContent.scrollTop, apiContent.scrollHeight);
    });
    
    // Mouse wheel event'lerini dinle
    logsContent.addEventListener('wheel', (e) => {
        console.log('Logs wheel event');
    });
    
    apiContent.addEventListener('wheel', (e) => {
        console.log('API wheel event');
    });
    
    console.log('Scroll indicators initialized');
}

function scrollToBottom(contentId) {
    const content = document.getElementById(contentId);
    if (content) {
        content.scrollTo({
            top: content.scrollHeight,
            behavior: 'smooth'
        });
        console.log(`Scrolling to bottom: ${contentId}`, content.scrollHeight);
    } else {
        console.log(`Element not found: ${contentId}`);
    }
}

function scrollToTop(contentId) {
    const content = document.getElementById(contentId);
    if (content) {
        content.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        console.log(`Scrolling to top: ${contentId}`);
    } else {
        console.log(`Element not found: ${contentId}`);
    }
}

// QR Payment Functions
function showQRPayment() {
    document.getElementById('qrModal').classList.add('active');
    logMessage('system', 'QR Ödeme ekranı açıldı');
    logApiRequest('GET', '/api/v1/qr/payment-options', 200, 'QR ödeme seçenekleri yüklendi');
}

function closeQRModal() {
    document.getElementById('qrModal').classList.remove('active');
    document.getElementById('qrCodeArea').classList.add('hidden');
}

function generateQR() {
    const qrArea = document.getElementById('qrCodeArea');
    const qrDisplay = qrArea.querySelector('.qr-placeholder');
    
    // Gerçek QR kod oluştur
    const qrData = {
        userId: currentUser.id,
        accountNumber: userAccounts[0].account_number,
        timestamp: Date.now(),
        amount: 'variable' // Kullanıcı belirleyecek
    };
    
    const qrString = JSON.stringify(qrData);
    
    // QR kod görüntüsü simüle et
    qrDisplay.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
            <div style="font-size: 8px; font-family: monospace; word-break: break-all; max-width: 200px;">
                █████████████████████████<br/>
                █▄▄▄▄▄█▀██▀█▄█▀▀▀▄▄▄▄▄█<br/>
                █ ███ █▄▀▄█▀█▀█▄▄█ ███ █<br/>
                █ ▀▀▀ █▀▄██▄▄█▀▄▀█ ▀▀▀ █<br/>
                █▄▄▄▄▄█ ▀ █▄▀ █ ▀█▄▄▄▄▄█<br/>
                █████████████████████████
            </div>
            <p style="margin-top: 10px; font-size: 12px;">${userAccounts[0].account_number}</p>
            <p style="margin: 5px 0; font-size: 11px; color: #666;">Miktar göndericiden alınacak</p>
        </div>
    `;
    
    qrArea.classList.remove('hidden');
    logMessage('success', `QR kod oluşturuldu - ${userAccounts[0].account_number} için para alma kodu`);
    logApiRequest('POST', '/api/v1/qr/generate', 201, 'QR kod başarıyla oluşturuldu');
}

function scanQR() {
    // Sahte QR kod tarama simülasyonu
    logMessage('system', 'QR kod tarama başlatıldı');
    logApiRequest('POST', '/api/v1/qr/scan', 200, 'Kamera erişimi istendi');
    
    setTimeout(() => {
        const scannedData = {
            userId: currentUser.id === 1 ? 2 : 1, // Diğer kullanıcı
            accountNumber: currentUser.id === 1 ? 'TR9876543210987654' : 'TR1234567890123456',
            amount: Math.floor(Math.random() * 500) + 50
        };
        
        const targetUser = Object.values(DEMO_USERS).find(u => u.id === scannedData.userId);
        
        showMessage('QR Kod Tarandı', 
            `Alıcı: ${targetUser.first_name} ${targetUser.last_name}\n` +
            `Hesap: ${scannedData.accountNumber}\n` +
            `Tutar: ${formatCurrency(scannedData.amount)} TL\n\n` +
            `Transfer işlemini onaylıyor musunuz?`
        );
        
        // Otomatik transfer simülasyonu
        setTimeout(() => {
            const senderAccount = userAccounts[0];
            if (senderAccount.balance >= scannedData.amount) {
                senderAccount.balance -= scannedData.amount;
                
                // Alıcı hesabını güncelle
                const receiverAccounts = Object.values(DEMO_ACCOUNTS).find(accounts => 
                    accounts.some(acc => acc.account_number === scannedData.accountNumber)
                );
                if (receiverAccounts) {
                    const receiverAccount = receiverAccounts.find(acc => acc.account_number === scannedData.accountNumber);
                    receiverAccount.balance += scannedData.amount;
                }
                
                updateUI();
                
                // İşlem geçmişine ekle
                const currentUserKey = document.getElementById('userSelect').value;
                addTransaction(currentUserKey, 'transfer_out', -scannedData.amount, 
                    'QR Ödeme', `${targetUser.first_name} ${targetUser.last_name}`, senderAccount.balance);
                
                // Evcil hayvan tepkisi
                updatePetAfterTransaction(scannedData.amount, 'transfer_out');
                
                logMessage('success', `QR ödeme başarılı: ${formatCurrency(scannedData.amount)} TL gönderildi`);
                logApiRequest('POST', '/api/v1/qr/payment', 200, 'QR ödeme işlemi tamamlandı');
            } else {
                showMessage('Hata', 'Yetersiz bakiye');
                logMessage('error', 'QR ödeme başarısız - Yetersiz bakiye');
            }
        }, 2000);
    }, 1500);
}

// Bill Payment Functions
function showBillPayment() {
    document.getElementById('billModal').classList.add('active');
    populatePaymentAccounts();
    logMessage('system', 'Fatura ödeme ekranı açıldı');
    logApiRequest('GET', '/api/v1/bills/types', 200, 'Fatura türleri yüklendi');
}

function closeBillModal() {
    document.getElementById('billModal').classList.remove('active');
    document.querySelector('#billModal form').reset();
}

function populatePaymentAccounts() {
    const paymentSelect = document.getElementById('paymentAccount');
    paymentSelect.innerHTML = '<option value="">Hesap seçin</option>';
    
    userAccounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.account_number;
        option.textContent = `${account.account_number} (${formatCurrency(account.balance)} TL)`;
        paymentSelect.appendChild(option);
    });
}

function payBill(event) {
    event.preventDefault();
    
    const billType = document.getElementById('billType').value;
    const billNumber = document.getElementById('billNumber').value;
    const paymentAccount = document.getElementById('paymentAccount').value;
    
    logMessage('system', `Fatura sorgulanıyor: ${billType} - ${billNumber}`);
    logApiRequest('GET', `/api/v1/bills/query/${billNumber}`, 200, 'Fatura bilgileri sorgulandı');
    
    // Sahte fatura tutarı
    const billAmount = Math.floor(Math.random() * 500) + 50;
    
    setTimeout(() => {
        logApiRequest('POST', '/api/v1/bills/pay', 200, 'Fatura ödeme işlemi tamamlandı');
        
        const account = userAccounts.find(acc => acc.account_number === paymentAccount);
        if (account && account.balance >= billAmount) {
            account.balance -= billAmount;
            
            updateUI();
            closeBillModal();
            
            // İşlem geçmişine ekle (bu otomatik olarak listeyii güncelleyecek)
            const currentUserKey = document.getElementById('userSelect').value;
            addTransaction(currentUserKey, 'transfer_out', -billAmount, `${getBillTypeName(billType)} Faturası`, 
                `Fatura No: ${billNumber}`, account.balance);
            
            logMessage('success', `${getBillTypeName(billType)} faturası ödendi: ${formatCurrency(billAmount)} TL`);
            showMessage('Başarılı', `Fatura ödemesi tamamlandı!\nTutar: ${formatCurrency(billAmount)} TL`);
        } else {
            logMessage('error', 'Yetersiz bakiye - Fatura ödemesi başarısız');
            showMessage('Hata', 'Yetersiz bakiye');
        }
    }, 1500);
}

function getBillTypeName(type) {
    const types = {
        'electric': 'Elektrik',
        'gas': 'Doğalgaz', 
        'water': 'Su',
        'internet': 'İnternet',
        'phone': 'Telefon',
        'insurance': 'Sigorta'
    };
    return types[type] || type;
}



// Credit Card Functions
let creditCards = [
    {
        id: 1,
        type: 'Banka Platinum',
        number: '**** **** **** 1234',
        limit: 50000,
        available: 42500,
        debt: 7500,
        isBlocked: false
    },
    {
        id: 2,
        type: 'Banka Gold',
        number: '**** **** **** 5678',
        limit: 25000,
        available: 23200,
        debt: 1800,
        isBlocked: false
    }
];

function showCreditCard() {
    document.getElementById('creditCardModal').classList.add('active');
    updateCreditCardDisplay();
    logMessage('system', 'Kredi kartları ekranı açıldı');
    logApiRequest('GET', '/api/v1/cards/list', 200, 'Kredi kartı bilgileri yüklendi');
}

function updateCreditCardDisplay() {
    const cardElements = document.querySelectorAll('.credit-card');
    cardElements.forEach((element, index) => {
        if (creditCards[index]) {
            const card = creditCards[index];
            const cardTypeElement = element.querySelector('.card-type');
            const availableElement = element.querySelector('.card-details span:nth-child(2)');
            const debtElement = element.querySelector('.card-debt');
            
            // Kart tipini güncelle
            if (cardTypeElement) {
                const baseType = card.type.replace('Banka ', '').replace('Bank ', '');
                cardTypeElement.textContent = currentLanguage === 'tr' ? `Banka ${baseType}` : `Bank ${baseType}`;
            }
            
            if (availableElement) {
                const availableText = currentLanguage === 'tr' ? 'Kullanılabilir' : 'Available';
                availableElement.textContent = `${availableText}: ${formatCurrency(card.available)} TL`;
            }
            
            if (debtElement) {
                const debtText = currentLanguage === 'tr' ? 'Borç' : 'Debt';
                debtElement.textContent = `${debtText}: ${formatCurrency(card.debt)} TL`;
                debtElement.style.color = card.debt > 0 ? '#ef4444' : '#10b981';
            }
            
            // Bloke durumu
            if (card.isBlocked) {
                element.style.opacity = '0.5';
                element.style.border = '2px solid #ef4444';
            } else {
                element.style.opacity = '1';
                element.style.border = '';
            }
        }
    });
}

function closeCreditCardModal() {
    document.getElementById('creditCardModal').classList.remove('active');
}

function blockCard() {
    const cardNumber = prompt('Hangi kartı bloke etmek istiyorsunuz?\n1234 veya 5678 son 4 hanesi');
    if (!cardNumber) return;
    
    const card = creditCards.find(c => c.number.endsWith(cardNumber));
    if (!card) {
        showMessage('Hata', 'Geçersiz kart numarası');
        return;
    }
    
    if (card.isBlocked) {
        showMessage('Bilgi', 'Bu kart zaten bloke edilmiş');
        return;
    }
    
    const result = confirm(`${card.type} kartını bloke etmek istediğinizden emin misiniz?\nKart numarası: ${card.number}`);
    
    if (result) {
        card.isBlocked = true;
        updateCreditCardDisplay();
        
        logMessage('warning', `${card.type} kartı bloke edildi`);
        logApiRequest('POST', '/api/v1/cards/block', 200, 'Kart bloke işlemi tamamlandı');
        showMessage('Başarılı', `${card.type} kartınız başarıyla bloke edildi`);
    }
}

function payCardDebt() {
    const totalDebt = creditCards.reduce((sum, card) => sum + card.debt, 0);
    
    if (totalDebt === 0) {
        showMessage('Bilgi', 'Ödenmesi gereken borç bulunmamaktadır');
        return;
    }
    
    if (userAccounts[0].balance < totalDebt) {
        showMessage('Hata', `Yetersiz bakiye. Toplam borç: ${formatCurrency(totalDebt)} TL`);
        logMessage('error', `Kredi kartı borç ödeme başarısız - Yetersiz bakiye`);
        return;
    }
    
    const result = confirm(`Toplam kredi kartı borcunuz: ${formatCurrency(totalDebt)} TL\n\nTümünü ödemek istiyor musunuz?`);
    
    if (result) {
        // Hesaptan para çek
        userAccounts[0].balance -= totalDebt;
        
        // Kart borçlarını temizle ve limitleri güncelle
        creditCards.forEach(card => {
            card.available += card.debt;
            card.debt = 0;
        });
        
        updateUI();
        updateCreditCardDisplay();
        
        // İşlem geçmişine ekle
        const currentUserKey = document.getElementById('userSelect').value;
        addTransaction(currentUserKey, 'transfer_out', -totalDebt, 
            'Kredi Kartı Borç Ödemesi', 'Kredi Kartları', userAccounts[0].balance);
        
        // Evcil hayvan tepkisi (borç ödeme pozitif)
        updatePetAfterTransaction(0, 'transfer_in'); // Borç ödeme olarak pozitif tepki
        
        logMessage('success', `Kredi kartı borcu ödendi: ${formatCurrency(totalDebt)} TL`);
        logApiRequest('POST', '/api/v1/cards/pay-debt', 200, 'Borç ödeme işlemi tamamlandı');
        showMessage('Başarılı', `Toplam ${formatCurrency(totalDebt)} TL kredi kartı borcunuz ödenmiştir`);
    }
}

// Support Functions
function showSupport() {
    document.getElementById('supportModal').classList.add('active');
    logMessage('system', 'Müşteri destek ekranı açıldı');
    logApiRequest('GET', '/api/v1/support/options', 200, 'Destek seçenekleri yüklendi');
}

function closeSupportModal() {
    document.getElementById('supportModal').classList.remove('active');
    document.getElementById('chatArea').classList.add('hidden');
}

function startChat() {
    document.getElementById('chatArea').classList.remove('hidden');
    logMessage('system', 'Canlı destek chat başlatıldı');
    logApiRequest('POST', '/api/v1/support/chat/start', 201, 'Chat oturumu oluşturuldu');
}

function callSupport() {
    logMessage('system', 'Telefon desteği aranıyor: 444 0 123');
    showMessage('Bilgi', 'Telefon desteği: 444 0 123\n7/24 hizmetinizdeyiz');
}

function showFAQ() {
    logMessage('system', 'SSS ekranı açılacak');
    showMessage('Bilgi', 'Sık Sorulan Sorular bölümü demo modunda mevcut değil');
}

function sendChatMessage(event) {
    if (event && event.key !== 'Enter') return;
    
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    const chatMessages = document.getElementById('chatMessages');
    
    // Kullanıcı mesajı
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user';
    userMessage.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-time">Şimdi</div>
    `;
    chatMessages.appendChild(userMessage);
    
    chatInput.value = '';
    
    logMessage('system', `Chat mesajı gönderildi: ${message}`);
    logApiRequest('POST', '/api/v1/support/chat/message', 200, 'Mesaj gönderildi');
    
    // Otomatik bot yanıtı
    setTimeout(() => {
        const botResponses = [
            'Mesajınız alındı, size yardımcı olmaya çalışıyorum.',
            'Bu konuda müşteri temsilcimiz sizinle iletişime geçecek.',
            'Sorunuz not edildi, en kısa sürede size dönüş yapacağız.',
            'Yardımcı olabildiysem ne mutlu! Başka sorunuz var mı?'
        ];
        
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot';
        botMessage.innerHTML = `
            <div class="message-content">${botResponses[Math.floor(Math.random() * botResponses.length)]}</div>
            <div class="message-time">Az önce</div>
        `;
        chatMessages.appendChild(botMessage);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        logApiRequest('POST', '/api/v1/support/chat/bot-response', 200, 'Bot yanıtı alındı');
    }, 1000);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

window.onclick = function(event) {
    const modals = [
        'transferModal', 'messageModal', 'confirmModal', 'qrModal', 
        'billModal', 'creditCardModal', 'supportModal'
    ];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.classList.remove('active');
            if (modalId === 'qrModal') {
                document.getElementById('qrCodeArea').classList.add('hidden');
            }
            if (modalId === 'supportModal') {
                document.getElementById('chatArea').classList.add('hidden');
            }
        }
    });
}

// ===== SANAL FİNANSAL EVCİL HAYVAN SİSTEMİ =====

function initializePetSystem() {
    const currentUserKey = document.getElementById('userSelect')?.value || 'a';
    petData = { ...DEMO_PETS[currentUserKey] };
    updatePetDisplay();
    
    // Evcil hayvan durumunu periyodik olarak güncelle
    setInterval(updatePetHealth, 30000); // 30 saniyede bir
    
    logMessage('system', '🐾 Evcil hayvan sistemi başlatıldı');
}

function updatePetDisplay() {
    if (!petData) return;
    
    // Ana ekrandaki evcil hayvan bilgilerini güncelle
    document.getElementById('petCharacter').textContent = petData.character;
    document.getElementById('petName').textContent = petData.name;
    document.getElementById('petLevel').textContent = `${t('petLevel')} ${petData.level}`;
    document.getElementById('petMood').textContent = getPetMoodDisplay();
    document.getElementById('petMessage').textContent = `"${t(petData.message)}"`;
    
    // Sağlık barını güncelle
    const healthPercentage = (petData.health / petData.maxHealth) * 100;
    document.getElementById('petHealthBar').style.width = `${healthPercentage}%`;
}



function getPetMoodDisplay() {
    const moodMap = {
        'very_happy': t('petVeryHappy'),
        'happy': t('petHappy'),
        'neutral': t('petNeutral'),
        'sad': t('petSad'),
        'very_sad': t('petVerySad')
    };
    
    return moodMap[petData.mood] || t('petNeutral');
}

function updatePetHealth() {
    if (!petData) return;
    
    const now = Date.now();
    const timeSinceLastFed = now - petData.lastFed;
    const hoursWithoutFood = timeSinceLastFed / (1000 * 60 * 60);
    
    // Zamanla sağlık ve mutluluk azalır
    if (hoursWithoutFood > 4 && petData.health > 20) {
        petData.health = Math.max(20, petData.health - 1);
        petData.happiness = Math.max(10, petData.happiness - 2);
        updatePetMood();
        updatePetDisplay();
    }
    
    // Finansal performansa göre evcil hayvan mesajını güncelle
    updatePetMessageBasedOnFinances();
}

function updatePetMood() {
    if (petData.happiness >= 80) {
        petData.mood = 'very_happy';
    } else if (petData.happiness >= 60) {
        petData.mood = 'happy';
    } else if (petData.happiness >= 40) {
        petData.mood = 'neutral';
    } else if (petData.happiness >= 20) {
        petData.mood = 'sad';
    } else {
        petData.mood = 'very_sad';
    }
}

function updatePetMessageBasedOnFinances() {
    const balance = userAccounts[0]?.balance || 0;
    const recentTransactions = transactionHistory[document.getElementById('userSelect').value] || [];
    
    // Basit finansal analiz
    let positiveActions = 0;
    let negativeActions = 0;
    
    if (balance > 10000) positiveActions++;
    if (recentTransactions.length > 0) {
        const recentSpending = recentTransactions
            .filter(t => t.type === 'transfer_out' && t.date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        if (recentSpending < 1000) positiveActions++;
        else if (recentSpending > 3000) negativeActions++;
    }
    
    // Mesajı güncelle
    if (positiveActions > negativeActions) {
        const positiveMessages = ['petPositiveMessage1', 'petPositiveMessage2', 'petPositiveMessage3'];
        petData.message = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
        if (petData.happiness < petData.maxHappiness) {
            petData.happiness = Math.min(petData.maxHappiness, petData.happiness + 5);
        }
    } else if (negativeActions > positiveActions) {
        const negativeMessages = ['petNegativeMessage1', 'petNegativeMessage2', 'petNegativeMessage3'];
        petData.message = negativeMessages[Math.floor(Math.random() * negativeMessages.length)];
        if (petData.happiness > 20) {
            petData.happiness = Math.max(20, petData.happiness - 3);
        }
    }
    
    updatePetMood();
}



function checkLevelUp() {
    if (petData.experience >= petData.maxExperience) {
        petData.level++;
        petData.experience = 0;
        petData.maxExperience = Math.floor(petData.maxExperience * 1.2); // Her seviyede %20 artış
        
        // Seviye atlama ödülleri
        petData.maxHealth = Math.min(150, petData.maxHealth + 10);
        petData.maxHappiness = Math.min(150, petData.maxHappiness + 10);
        petData.health = petData.maxHealth; // Tam sağlık
        petData.happiness = petData.maxHappiness; // Tam mutluluk
        
        // Yeni başarı kontrol et
        if (petData.level >= 5 && !petData.achievements.includes('savingsMaster')) {
            petData.achievements.push('savingsMaster');
        }
        
        logMessage('success', `${t('petLevelUp')} ${t('petLevel')} ${petData.level}!`);
        showMessage(t('success'), `${t('petLevelUp')}\n${petData.name} artık seviye ${petData.level}!`);
        
        // Seviye atlama animasyonu
        animateLevelUp();
    }
}

function animatePetAction(actionType) {
    const petCharacter = document.getElementById('petCharacter');
    
    let animation = '';
    switch(actionType) {
        case 'feed':
            animation = 'petBounce 0.5s ease-in-out 3';
            break;
        case 'play':
            animation = 'petBounce 0.3s ease-in-out 5';
            break;
        case 'pet':
            animation = 'petBounce 0.8s ease-in-out 2';
            break;
    }
    
    if (petCharacter) {
        petCharacter.style.animation = animation;
        setTimeout(() => {
            petCharacter.style.animation = 'petBounce 2s ease-in-out infinite';
        }, 2000);
    }
}

function animateLevelUp() {
    const petCharacter = document.getElementById('petCharacter');
    if (petCharacter) {
        petCharacter.style.animation = 'petBounce 0.3s ease-in-out 8';
        setTimeout(() => {
            petCharacter.style.animation = 'petBounce 2s ease-in-out infinite';
        }, 3000);
    }
}

// Transfer işleminden sonra evcil hayvan tepkisi
function updatePetAfterTransaction(amount, type) {
    if (!petData) return;
    
    if (type === 'transfer_out' && amount > 1000) {
        // Büyük harcama - evcil hayvan üzülür
        petData.happiness = Math.max(10, petData.happiness - 10);
        petData.message = 'petNegativeMessage1';
    } else if (type === 'transfer_in') {
        // Para geldi - evcil hayvan mutlu olur
        petData.happiness = Math.min(petData.maxHappiness, petData.happiness + 15);
        petData.experience = Math.min(petData.maxExperience, petData.experience + 5);
        petData.message = 'petPositiveMessage2';
    }
    
    updatePetMood();
    checkLevelUp();
    updatePetDisplay();
    
    logMessage('system', `🐾 Evcil hayvan işleme tepki verdi: ${getPetMoodDisplay()}`);
} 