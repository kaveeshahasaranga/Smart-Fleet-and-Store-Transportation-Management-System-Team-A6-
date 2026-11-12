import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthLayout, { Icon } from './AuthLayout.jsx';

const storeFeatures = [
  { icon: 'booking', title: 'Store booking requests', description: 'Request goods transport between stores and hubs.' },
  { icon: 'tracking', title: 'Live trip tracking', description: 'Follow multi-stop runs on their way to your store.' },
  { icon: 'box', title: 'Goods handover and receipts', description: 'Confirm deliveries and record any discrepancies.' },
];

const recoveryFeatures = [
  { icon: 'email', title: 'Check your work email', description: 'The reset link goes to the address on your account.' },
  { icon: 'clock', title: 'Link expires in 30 minutes', description: 'Request a new link if yours has expired.' },
  { icon: 'lock', title: 'Other sessions sign out', description: 'Devices using the old password are signed out.' },
];

function AuthField({ id, label, type = 'text', required = true, children, ...props }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}{required && <span className="required"> *</span>}</label>
      <div className="input-wrap">
        {children}
        <input id={id} name={id} type={type} required={required} {...props} />
      </div>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, autoComplete, trailing, validateStrength = false }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="field">
      <div className="label-row">
        <label htmlFor={id}>{label}<span className="required"> *</span></label>
        {trailing}
      </div>
      <div className="input-wrap has-action">
        <Icon name="lock" className="input-icon" />
        <input
          autoComplete={autoComplete}
          id={id}
          name={id}
          onChange={onChange}
          minLength={validateStrength ? 8 : undefined}
          pattern={validateStrength ? '(?=.*[A-Z])(?=.*[0-9]).{8,}' : undefined}
          required
          title={validateStrength ? 'Use at least 8 characters, including an uppercase letter and a number.' : undefined}
          type={visible ? 'text' : 'password'}
          value={value}
        />
        <button
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="input-action"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );
}

function FormCard({ icon, title, description, children, className = '' }) {
  return (
    <div className={`auth-card ${className}`}>
      {icon && <span className="card-icon"><Icon name={icon} /></span>}
      <h2>{title}</h2>
      {description && <p className="card-description">{description}</p>}
      {children}
    </div>
  );
}

function FrontendOnlyForm({ children, className = '', onSubmit }) {
  const [notice, setNotice] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    setNotice(onSubmit);
  };
  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}
      {notice && <p className="form-notice" role="status">{notice}</p>}
    </form>
  );
}

export function SignInPage() {
  return (
    <AuthLayout
      description="Sign in to manage bookings, track deliveries and confirm goods at your store."
      eyebrow="Store Portal & Admin Dashboard"
      features={storeFeatures}
      support
      title="Move store goods with fewer calls and less paperwork."
    >
      <FormCard title="Sign in" description="Enter your work email and password to continue.">
        <FrontendOnlyForm className="auth-form" onSubmit="Sign-in form submitted. Connect it to your authentication service to enable account access.">
          <AuthField autoComplete="email" id="email" label="Work email" type="email">
            <Icon name="email" className="input-icon" />
          </AuthField>
          <PasswordField
            autoComplete="current-password"
            id="password"
            label="Password"
            trailing={<Link to="/forgot-password">Forgot password?</Link>}
          />
          <label className="check-row">
            <input type="checkbox" name="remember" defaultChecked />
            <span>Keep me signed in on this device</span>
          </label>
          <button className="primary-button" type="submit">Sign in <span aria-hidden="true">→</span></button>
          <div className="info-callout"><span aria-hidden="true">ⓘ</span> You go straight to the Store Portal or Admin Dashboard, based on your account role.</div>
        </FrontendOnlyForm>
        <p className="switch-auth">New to FleetFlow? <Link to="/signup">Create an account</Link></p>
      </FormCard>
    </AuthLayout>
  );
}

export function SignUpPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  return (
    <AuthLayout
      description="Create an account to request transport and confirm deliveries for your store."
      eyebrow="Store Portal Registration"
      features={storeFeatures}
      title="Set up your store account."
    >
      <FormCard className="signup-card" title="Create account" description="Tell us who you are and which store you work at.">
        <FrontendOnlyForm className="auth-form signup-form" onSubmit="Registration form submitted. Connect it to your account service to create an account.">
          <div className="field-grid">
            <AuthField autoComplete="name" id="full-name" label="Full name" />
            <AuthField autoComplete="email" id="signup-email" label="Work email" type="email" />
            <AuthField autoComplete="tel" id="phone" label="Contact number" type="tel" placeholder="+94  077 123 4567" />
            <div className="field">
              <label htmlFor="store">Store location<span className="required"> *</span></label>
              <div className="input-wrap select-wrap">
                <Icon name="booking" className="input-icon" />
                <select id="store" name="store" required defaultValue="">
                  <option value="" disabled>Select your store</option>
                  <option value="nugegoda">Nugegoda Store (#104)</option>
                  <option value="colombo">Colombo Central (#101)</option>
                  <option value="kandy">Kandy Store (#208)</option>
                </select>
              </div>
            </div>
          </div>
          <fieldset className="role-field">
            <legend>Role<span className="required"> *</span></legend>
            <div className="role-options">
              <label className="role-option selected">
                <input type="radio" name="role" value="staff" defaultChecked />
                <span className="role-icon">♙</span>
                <span><strong>Store Staff</strong><small>Bookings and receipts</small></span>
              </label>
              <label className="role-option">
                <input type="radio" name="role" value="manager" />
                <span className="role-icon">▣</span>
                <span><strong>Store Manager</strong><small>Verifies store handovers</small></span>
              </label>
            </div>
          </fieldset>
          <div className="field-grid">
            <PasswordField autoComplete="new-password" id="signup-password" label="Password" onChange={(event) => setPassword(event.target.value)} validateStrength value={password} />
            <PasswordField autoComplete="new-password" id="confirm-password" label="Confirm password" onChange={(event) => setConfirmPassword(event.target.value)} value={confirmPassword} />
          </div>
          <p className="password-hint"><span aria-hidden="true">ⓘ</span> Use at least 8 characters, including an uppercase letter and a number.</p>
          <label className="check-row">
            <input type="checkbox" name="terms" required />
            <span>I agree to the <a href="#terms">Terms of Use</a> and <a href="#privacy">Privacy Policy</a></span>
          </label>
          <button className="primary-button" type="submit" disabled={Boolean(confirmPassword) && password !== confirmPassword}>
            Create account <span aria-hidden="true">→</span>
          </button>
          {confirmPassword && password !== confirmPassword && <p className="field-error" role="alert">Passwords do not match.</p>}
        </FrontendOnlyForm>
        <p className="switch-auth">Already have an account? <Link to="/signin">Sign in</Link></p>
      </FormCard>
    </AuthLayout>
  );
}

export function ForgotPasswordPage() {
  return (
    <AuthLayout
      description="We will email you a one-time link so you can get back into your account."
      eyebrow="Account Recovery"
      features={recoveryFeatures}
      support
      title="Reset your password securely."
    >
      <FormCard icon="key" title="Forgot password?" description="Enter the work email on your account and we will send you a reset link.">
        <FrontendOnlyForm className="auth-form" onSubmit="Request captured in this frontend demo. Connect this form to your service to send a reset link.">
          <AuthField autoComplete="email" id="recovery-email" label="Work email" type="email">
            <Icon name="email" className="input-icon" />
          </AuthField>
          <button className="primary-button" type="submit">Send reset link <span aria-hidden="true">↗</span></button>
          <div className="info-callout"><span aria-hidden="true">ⓘ</span> Can't find the email? Check your spam folder, or try again in 60 seconds.</div>
        </FrontendOnlyForm>
        <p className="back-link"><Link to="/signin"><span aria-hidden="true">←</span> Back to sign in</Link></p>
      </FormCard>
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  const location = useLocation();
  const emailFromLink = new URLSearchParams(location.search).get('email') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  return (
    <AuthLayout
      description="Your old password stops working as soon as you save the new one."
      eyebrow="Account Recovery"
      features={recoveryFeatures}
      title="Choose a new password."
    >
      <FormCard icon="lock" title="Reset password" description="Create a new password for your account.">
        <FrontendOnlyForm className="auth-form" onSubmit="Password form submitted. Connect it to your password reset service to save your new password.">
          <AuthField autoComplete="email" id="account-email" label="Account" type="email" defaultValue={emailFromLink} />
          <PasswordField autoComplete="new-password" id="new-password" label="New password" onChange={(event) => setPassword(event.target.value)} validateStrength value={password} />
          <p className="password-hint"><span aria-hidden="true">ⓘ</span> At least 8 characters, with an uppercase letter and a number.</p>
          <PasswordField autoComplete="new-password" id="confirm-new-password" label="Confirm new password" onChange={(event) => setConfirmPassword(event.target.value)} value={confirmPassword} />
          {confirmPassword && password !== confirmPassword && <p className="field-error" role="alert">Passwords do not match.</p>}
          {confirmPassword && password === confirmPassword && <p className="match-hint">✓ Passwords match</p>}
          <button className="primary-button" type="submit" disabled={!password || password !== confirmPassword}>
            Save new password <span aria-hidden="true">→</span>
          </button>
        </FrontendOnlyForm>
        <p className="back-link"><Link to="/signin"><span aria-hidden="true">←</span> Back to sign in</Link></p>
      </FormCard>
    </AuthLayout>
  );
}
