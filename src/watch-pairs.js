const pairs = {
  SWT_CNY: {
    buy: false,
    type: "SWT卖单",
    minAmount: 2e6
  },
  CNY_SWT: {
    buy: true,
    type: "SWT买单",
    minAmount: 2e6
  },
  SWT_JJCC: {
    buy: true,
    type: "JJCC买单",
    minAmount: 20000
  },
  JJCC_SWT: {
    buy: false,
    type: "JJCC卖单",
    minAmount: 20000
  },
  JJCC_CNY: {
    buy: false,
    type: "JJCC卖单",
    minAmount: 20000
  },
  CNY_JJCC: {
    buy: true,
    type: "JJCC买单",
    minAmount: 20000
  },
  SWT_JMOAC: {
    buy: true,
    type: "JMOAC买单",
    minAmount: 1000
  },
  JMOAC_SWT: {
    buy: false,
    type: "JMOAC卖单",
    minAmount: 1000
  },
  JMOAC_CNY: {
    buy: false,
    type: "JMOAC卖单",
    minAmount: 1000
  },
  CNY_JMOAC: {
    buy: true,
    type: "JMOAC买单",
    minAmount: 1000
  }
};

const tokens = {
  SWT: {
    minAmount: 10000000
  },
  JJCC: {
    minAmount: 100000
  },
  CNY: {
    minAmount: 50000
  },
  JMOAC: {
    minAmount: 50000
  }
};
