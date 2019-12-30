const ICON = "notification-icon.jpg";

const SWTCSCAN = "https://swtcscan.jccdex.cn/#/trade/tradeDetail/?hash=";

const jingtumRemote = new swtc_lib.Remote({
  server: "wss://hc.jingtum.com:5020",
  local_sign: true
});

function connectNode() {
  if (!jingtumRemote.isConnected()) {
    jingtumRemote.connect(function(err, result) {
      var notification;
      if (err) {
        notification = new Notification("连接井通节点失败");
      } else {
        notification = new Notification("连接井通节点成功");
      }
      setTimeout(() => {
        notification.close();
      }, 1000);
    });
  }
}

connectNode();

function isNumber(n) {
  return !Number.isNaN(parseFloat(n)) && Number.isFinite(parseFloat(n));
}

const getMirrorAccount = (account) => {
  return account.substring(0, 16) + "..." + account.substring(25);
};

jingtumRemote.on("transactions", (data) => {
  var notification;
  if (data.engine_result === "tesSUCCESS" && data.transaction) {
    let transaction = data.transaction;
    let Account = transaction.Account;
    let TransactionType = transaction.TransactionType;

    if (TransactionType === "OfferCreate") {
      if (Accounts.includes(Account)) {
        notification = new Notification(accountMirror, {
          data: SWTCSCAN + transaction.hash,
          body: "监控地址发起了挂单",
          icon: ICON
        });
      } else {
        let takerGets = transaction.TakerGets;
        let takerPays = transaction.TakerPays;
        let accountMirror = getMirrorAccount(Account);
        if (isNumber(takerGets)) {
          takerGets = {
            value: parseFloat(takerGets) / 1e6,
            currency: "SWT"
          };
        }

        if (isNumber(takerPays)) {
          takerPays = {
            value: parseFloat(takerPays) / 1e6,
            currency: "SWT"
          };
        }
        let pair = takerGets.currency + "_" + takerPays.currency;
        let pairInfo = pairs[pair];
        if (pairInfo) {
          let amount = pairInfo.buy ? takerPays.value : takerGets.value;
          if (parseFloat(amount) >= pairInfo.minAmount) {
            notification = new Notification(accountMirror, {
              data: SWTCSCAN + transaction.hash,
              body: `${parseFloat(amount).toLocaleString()} ${pairInfo.type}`,
              icon: ICON
            });
          }
        }
      }
    } else if (TransactionType === "Payment") {
      if (Accounts.includes(Account) || Accounts.includes(transaction.Destination)) {
        let Destination = transaction.Destination;
        let destinationMirror = getMirrorAccount(Destination);
        let isSender = Accounts.includes(Account);
        notification = new Notification(isSender ? accountMirror : destinationMirror, {
          data: SWTCSCAN + transaction.hash,
          body: isSender ? "发起了转账" : "收到了转账",
          icon: ICON
        });
      } else {
        let Amount = transaction.Amount;
        if (isNumber(Amount)) {
          Amount = {
            currency: "SWT",
            value: parseFloat(Amount) / 1e6
          };
        }
        let tokenInfo = tokens[Amount.currency];
        if (tokenInfo && parseFloat(Amount.value) >= tokenInfo.minAmount) {
          notification = new Notification(getMirrorAccount(Account), {
            data: SWTCSCAN + transaction.hash,
            body: "转账" + parseFloat(Amount.value).toLocaleString() + " " + Amount.currency,
            icon: ICON
          });
        }
      }
    }
  }
  if (notification) {
    notification.onclick = function() {
      window.open(notification.data);
      notification.close();
      notification = null;
    };
  }
});
