import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initializing EmailJS with public key
    emailjs.init("lTPBoadCqWnp3hNLM");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const serviceId = "service_ow9fquh";
    const templateId = "template_7xua66n";
    try {
      await emailjs.send(serviceId, templateId, {
        name: formData.name,
        email: formData.email,
        message: formData.message
      });
      toast.success("Email successfully sent!");
      // Reset form fields
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error("Email sending error:", error);
      toast.error("Failed to send email. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-lg mb-2" htmlFor="name">
          Name:
        </label>
        <input
          className="w-full px-4 py-2 border rounded-md"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg mb-2" htmlFor="email">
          Email:
        </label>
        <input
          className="w-full px-4 py-2 border rounded-md"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg mb-2" htmlFor="message">
          Message:
        </label>
        <textarea
          className="w-full px-4 py-2 border rounded-md"
          id="message"
          name="message"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Sending..." : "Submit"}
      </button>
    </form>
  );
};

export default ContactForm;
