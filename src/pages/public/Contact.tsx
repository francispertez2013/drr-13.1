import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, AlertTriangle, Send, Facebook, Twitter, Linkedin, Share2, Instagram, Check } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: 'Municipal Bldg, DRRM Operation Center\nBarangay Caratagan, Pio Duran, Albay\n4516, Philippines',
      color: 'bg-yellow-500'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '911 / (052) 234-5678',
      color: 'bg-yellow-500'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'mdrrmo@pioduran.gov.ph',
      color: 'bg-yellow-500'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Monday - Friday: 8:00 AM - 5:00 PM\nSaturday: Emergency Only\nSunday: Emergency Only',
      color: 'bg-yellow-500'
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/mdrrmo.pioduran', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/mdrrmo_pioduran', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/mdrrmo-pioduran', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com/mdrrmo.pioduran', label: 'Instagram' }
  ];

  return (
    <>
      <div className="bg-white min-h-screen pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-6">
                <Mail className="text-blue-950" size={32} />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-950 mb-6">Get In Touch</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mb-6"></div>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Contact Form */}
              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-950 mb-8 flex items-center">
                  <Send className="mr-3 text-yellow-500" size={28} />
                  Send Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        placeholder="Juan"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        placeholder="Dela Cruz"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      placeholder="juandelacruz@gmail.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      placeholder="How can we help?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none transition-all duration-300"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-base ${
                      isSubmitted 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-blue-950 shadow-lg'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-950"></div>
                        <span>Sending...</span>
                      </>
                    ) : isSubmitted ? (
                      <>
                        <Check size={20} />
                        <span>Message Sent!</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
                  <h2 className="text-2xl md:text-3xl font-bold text-blue-950 mb-8 flex items-center">
                    <MapPin className="mr-3 text-yellow-500" size={28} />
                    Contact Information
                  </h2>
                  
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-white transition-all duration-300 border border-transparent hover:border-gray-200"
                      >
                        <div className={`${info.color} p-3 rounded-lg shadow-md`}>
                          <info.icon className="w-5 h-5 text-blue-950" />
                        </div>
                        <div>
                          <h3 className="text-blue-950 font-bold text-lg mb-1">{info.title}</h3>
                          <p className="text-gray-600 whitespace-pre-line text-base leading-relaxed">{info.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
                  <h3 className="text-xl md:text-2xl font-bold text-blue-950 mb-6 flex items-center">
                    <Share2 className="mr-3 text-yellow-500" size={24} />
                    Follow Us
                  </h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-yellow-500 p-3 rounded-lg transition-all duration-300 group shadow-md hover:scale-110"
                        title={social.label}
                      >
                        <social.icon className="w-5 h-5 text-blue-950 group-hover:text-blue-950" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Emergency Notice */}
                <div className="bg-red-50 rounded-2xl p-6 md:p-8 shadow-lg border border-red-200">
                  <h3 className="text-xl md:text-2xl font-bold text-blue-950 mb-4 flex items-center">
                    <AlertTriangle className="mr-3 text-yellow-500" size={24} />
                    Emergency Contact
                  </h3>
                  <p className="text-red-700 mb-6 text-base leading-relaxed">
                    For immediate emergency assistance, please call our 24/7 hotline:
                  </p>
                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg flex items-center justify-center text-xl hover:scale-105 transition-transform duration-300">
                    <Phone className="mr-3" size={24} />
                    <span>911</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;