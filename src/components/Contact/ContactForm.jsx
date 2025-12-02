import React from 'react'

export default function ContactForm() {
  return (
    <form className="contact-form">
      <label>Name<input name="name" /></label>
      <label>Email<input name="email" type="email"/></label>
      <label>Phone<input name="phone"/></label>
      <label>I'm Interested In:
        <select name="interest">
          <option>Wealthcraft</option>
          <option>Alphalabs</option>
          <option>Other</option>
        </select>
      </label>
      <label>Message<textarea name="message"></textarea></label>
      <button type="submit">Schedule My Call</button>
    </form>
  )
}
