/** EmailJS — contact form delivery to team.mendr@gmail.com */
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'service_z6lmonn',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? 'template_m3kn40m',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? 'osD6OnZ-mOciwGiTP',
}

export function contactFormParams(fields: {
  name: string
  email: string
  company: string
  message: string
}) {
  const name = fields.name.trim()
  const email = fields.email.trim()
  const company = fields.company.trim()
  const message = fields.message.trim()

  return {
    title: company || `Message from ${name}`,
    from_name: name,
    from_email: email,
    name,
    email,
    company: company || '-',
    message: message || '-',
  }
}
