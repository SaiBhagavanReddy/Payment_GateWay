import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Credit.css";

const Card = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // UPI
  const [upiId, setUpiId] = useState("");

  // Net banking
  const [bank, setBank] = useState("");

  // Payment state
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const subtotal = 1000;
  const discount = 100;
  const tax = 90;
  const total = subtotal - discount + tax;

  // -----------------------------
  // Card Number
  // -----------------------------
  const handleCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 16) {
      value = value.substring(0, 16);
    }

    const formatted = value.match(/.{1,4}/g)?.join(" ") || "";

    setCardNumber(formatted);

    if (errors.cardNumber) {
      setErrors((prev) => ({
        ...prev,
        cardNumber: "",
      }));
    }
  };

  // -----------------------------
  // Card Holder
  // -----------------------------
  const handleCardHolder = (e) => {
    const value = e.target.value;

    if (/^[a-zA-Z\s]*$/.test(value)) {
      setCardHolder(value);

      if (errors.cardHolder) {
        setErrors((prev) => ({
          ...prev,
          cardHolder: "",
        }));
      }
    }
  };

  // -----------------------------
  // Expiry
  // -----------------------------
  const handleExpiry = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 4) {
      value = value.substring(0, 4);
    }

    if (value.length >= 3) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }

    setExpiry(value);

    if (errors.expiry) {
      setErrors((prev) => ({
        ...prev,
        expiry: "",
      }));
    }
  };

  // -----------------------------
  // CVV
  // -----------------------------
  const handleCvv = (e) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 3);

    setCvv(value);

    if (errors.cvv) {
      setErrors((prev) => ({
        ...prev,
        cvv: "",
      }));
    }
  };

  // -----------------------------
  // UPI
  // -----------------------------
  const handleUpi = (e) => {
    setUpiId(e.target.value);

    if (errors.upiId) {
      setErrors((prev) => ({
        ...prev,
        upiId: "",
      }));
    }
  };

  // -----------------------------
  // Validation
  // -----------------------------
  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        newErrors.cardNumber = "Enter a valid 16-digit card number";
      }

      if (!cardHolder.trim()) {
        newErrors.cardHolder = "Enter card holder name";
      }

      if (expiry.length !== 5) {
        newErrors.expiry = "Enter expiry as MM/YY";
      } else {
        const [month, year] = expiry.split("/");

        const monthNumber = Number(month);

        if (monthNumber < 1 || monthNumber > 12) {
          newErrors.expiry = "Enter a valid month";
        }

        const currentYear = new Date().getFullYear() % 100;

        if (Number(year) < currentYear) {
          newErrors.expiry = "Card has expired";
        }
      }

      if (cvv.length !== 3) {
        newErrors.cvv = "CVV must contain 3 digits";
      }
    }

    if (paymentMethod === "upi") {
      const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;

      if (!upiId.trim()) {
        newErrors.upiId = "Enter your UPI ID";
      } else if (!upiRegex.test(upiId)) {
        newErrors.upiId = "Enter a valid UPI ID";
      }
    }

    if (paymentMethod === "netbanking") {
      if (!bank) {
        newErrors.bank = "Please select your bank";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // Payment
  // -----------------------------
  const handlePayment = () => {
    if (!validateForm()) {
      toast.error("Please correct the highlighted fields");
      return;
    }

    setPaymentStatus("loading");

    // Mock payment simulation
    setTimeout(() => {
      const paymentSuccessful = Math.random() > 0.2;

      if (paymentSuccessful) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("error");
      }
    }, 2000);
  };

  // -----------------------------
  // Retry
  // -----------------------------
  const handleRetry = () => {
    setPaymentStatus("idle");
  };

  // -----------------------------
  // Change payment method
  // -----------------------------
  const changePaymentMethod = (method) => {
    setPaymentMethod(method);
    setPaymentStatus("idle");
    setErrors({});
  };

  return (
    <div className="payment-page">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="payment-container">

        {/* HEADER */}
        <div className="payment-header">
          <div>
            <h1>Secure Checkout</h1>
            <p>Complete your payment securely</p>
          </div>

          <div className="secure-badge">
            🔒 Secure Payment
          </div>
        </div>

        <div className="checkout-grid">

          {/* LEFT SIDE */}
          <div className="payment-card">

            <h2>Payment Method</h2>

            {/* PAYMENT TABS */}
            <div className="payment-tabs">

              <button
                className={paymentMethod === "card" ? "active" : ""}
                onClick={() => changePaymentMethod("card")}
              >
                💳
                <span>Card</span>
              </button>

              <button
                className={paymentMethod === "upi" ? "active" : ""}
                onClick={() => changePaymentMethod("upi")}
              >
                📱
                <span>UPI</span>
              </button>

              <button
                className={
                  paymentMethod === "netbanking" ? "active" : ""
                }
                onClick={() => changePaymentMethod("netbanking")}
              >
                🏦
                <span>Net Banking</span>
              </button>

            </div>

            {/* CARD FORM */}
            {paymentMethod === "card" && (
              <div className="form-section">

                <div className="card-preview">
                  <div className="chip">▦</div>

                  <div className="preview-number">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>

                  <div className="preview-bottom">
                    <div>
                      <small>CARD HOLDER</small>
                      <p>{cardHolder || "YOUR NAME"}</p>
                    </div>

                    <div>
                      <small>EXPIRES</small>
                      <p>{expiry || "MM/YY"}</p>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Card Number</label>

                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumber}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />

                  {errors.cardNumber && (
                    <span className="error-text">
                      {errors.cardNumber}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Card Holder Name</label>

                  <input
                    type="text"
                    value={cardHolder}
                    onChange={handleCardHolder}
                    placeholder="Sai Ram"
                  />

                  {errors.cardHolder && (
                    <span className="error-text">
                      {errors.cardHolder}
                    </span>
                  )}
                </div>

                <div className="input-row">

                  <div className="form-group">
                    <label>Expiry Date</label>

                    <input
                      type="text"
                      value={expiry}
                      onChange={handleExpiry}
                      placeholder="MM/YY"
                      maxLength={5}
                    />

                    {errors.expiry && (
                      <span className="error-text">
                        {errors.expiry}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>CVV</label>

                    <input
                      type="password"
                      value={cvv}
                      onChange={handleCvv}
                      placeholder="•••"
                      maxLength={3}
                    />

                    {errors.cvv && (
                      <span className="error-text">
                        {errors.cvv}
                      </span>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* UPI FORM */}
            {paymentMethod === "upi" && (
              <div className="form-section">

                <div className="upi-icon">
                  📱
                </div>

                <h3>Pay using UPI</h3>

                <p className="form-description">
                  Enter your UPI ID to continue with payment.
                </p>

                <div className="form-group">

                  <label>UPI ID</label>

                  <input
                    type="text"
                    value={upiId}
                    onChange={handleUpi}
                    placeholder="example@upi"
                  />

                  {errors.upiId && (
                    <span className="error-text">
                      {errors.upiId}
                    </span>
                  )}

                </div>

                <div className="upi-hint">
                  Example: sai@ybl, sai@oksbi, sai@paytm
                </div>

              </div>
            )}

            {/* NET BANKING */}
            {paymentMethod === "netbanking" && (
              <div className="form-section">

                <div className="bank-icon">
                  🏦
                </div>

                <h3>Net Banking</h3>

                <p className="form-description">
                  Select your bank to continue.
                </p>

                <div className="form-group">

                  <label>Select Bank</label>

                  <select
                    value={bank}
                    onChange={(e) => {
                      setBank(e.target.value);

                      if (errors.bank) {
                        setErrors((prev) => ({
                          ...prev,
                          bank: "",
                        }));
                      }
                    }}
                  >
                    <option value="">Choose your bank</option>
                    <option value="SBI">
                      State Bank of India
                    </option>
                    <option value="HDFC">
                      HDFC Bank
                    </option>
                    <option value="ICICI">
                      ICICI Bank
                    </option>
                    <option value="Axis">
                      Axis Bank
                    </option>
                    <option value="Kotak">
                      Kotak Mahindra Bank
                    </option>
                  </select>

                  {errors.bank && (
                    <span className="error-text">
                      {errors.bank}
                    </span>
                  )}

                </div>

              </div>
            )}

            {/* PAYMENT BUTTON / STATUS */}
            {paymentStatus === "idle" && (
              <button
                className="pay-button"
                onClick={handlePayment}
              >
                Pay ₹{total.toLocaleString("en-IN")}
              </button>
            )}

            {paymentStatus === "loading" && (
              <div className="payment-status loading-status">
                <div className="spinner"></div>
                <h3>Processing Payment...</h3>
                <p>Please don't close this window.</p>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="payment-status success-status">
                <div className="status-icon">✓</div>

                <h3>Payment Successful!</h3>

                <p>
                  Your payment of ₹
                  {total.toLocaleString("en-IN")} was completed
                  successfully.
                </p>

                <span className="transaction-id">
                  Transaction ID: TXN{Date.now()}
                </span>
              </div>
            )}

            {paymentStatus === "error" && (
              <div className="payment-status error-status">
                <div className="status-icon">✕</div>

                <h3>Payment Failed</h3>

                <p>
                  We couldn't process your payment.
                  Please try again.
                </p>

                <button
                  className="retry-button"
                  onClick={handleRetry}
                >
                  Try Again
                </button>
              </div>
            )}

          </div>

          {/* RIGHT SIDE - ORDER SUMMARY */}
          <div className="order-summary">

            <h2>Order Summary</h2>

            <div className="product">
              <div className="product-icon">
                🛒
              </div>

              <div>
                <h3>Premium Plan</h3>
                <p>1 × Subscription</p>
              </div>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row discount">
              <span>Discount</span>
              <span>-₹{discount.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>₹{tax.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="total-row">
              <span>Total</span>
              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="secure-info">
              🔒 Your payment information is encrypted and secure.
            </div>

            <div className="accepted">
              <span>We accept</span>

              <div>
                💳 &nbsp; UPI &nbsp; 🏦
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Card;