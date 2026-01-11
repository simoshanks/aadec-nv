import React, { useState } from "react";
import { Send, CheckCircle, X } from "lucide-react";

const faqItems = [
  {
    question: "Comment puis-je contribuer au développement de votre association ?",
    answer:
      "Vous pouvez nous accompagner de différentes façons : en devenant bénévole, en apportant un soutien financier, en établissant un partenariat ou simplement en participant à nos actions et événements. Chaque geste compte et renforce notre impact au sein des communautés. Contactez-nous pour découvrir comment vous pouvez faire partie de cette belle aventure.",
  },
  {
    question: "Quels sont les domaines d'intervention de l'AADEC ?",
    answer:
      "Nous intervenons dans plusieurs domaines incluant l'environnement, la santé, le social, la culture et les échanges culturels. Vous pouvez voir la page 'Réalisation' pour plus de détails.",
  },
  {
    question: "Puis-je visiter vos locaux ?",
    answer:
      "Oui, nous accueillons sur rendez-vous. Veuillez nous contacter au préalable pour planifier votre visite.",
  },
  {
    question: "Comment puis-je obtenir un partenariat avec vous ?",
    answer:
      "N’hésitez pas à nous contacter, à nous écrire ou à visiter le siège de notre association (voir la carte au bas de la page).",
  },
];

const ContactMain = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, subject, message } = formData;
    const body = `
Nom: ${firstName} ${lastName}
Email: ${email}
Téléphone: ${phone}

Message:
${message}
`;
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=aadec2000@hotmail.com&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(gmailLink, "_blank");
    setShowAlert(true);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section className="bg-[#F9F6F0] py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* ✅ Left: Form */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-10 relative hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 text-black">
          {showAlert && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white border border-green-200 rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-md z-50 animate-fadeIn">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1">
                    Merci !
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Votre message a été envoyé avec succès.
                  </p>
                </div>
                <button
                  onClick={() => setShowAlert(false)}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                </button>
              </div>
            </div>
          )}

          <h3 className="text-2xl sm:text-3xl font-bold text-[#146C2D] mb-6 sm:mb-8 text-center">
            Envoyez-nous un message
          </h3>

          <form id="rendezvous" className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-6">
              <input
                type="text"
                name="firstName"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 w-full text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#22A55D] focus:border-transparent"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Nom"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 w-full text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#22A55D] focus:border-transparent"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 w-full text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#22A55D]"
            />

            <input
              type="number"
              name="phone"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 w-full text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#22A55D]"
            />

            <input
              type="text"
              name="subject"
              placeholder="Sujet"
              value={formData.subject}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 w-full text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#22A55D]"
            />

            <textarea
              name="message"
              rows={4}
              placeholder="Votre message..."
              value={formData.message}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 w-full text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#22A55D] resize-none"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-[#146C2D] text-white py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" /> Envoyer
            </button>
          </form>
        </div>

        {/* ✅ Right: FAQ */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-10 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#146C2D] mb-2 sm:mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Trouvez rapidement des réponses à vos questions
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqItems.map((item, index) => (
              <details
                key={index}
                className="group bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-100 transition-all duration-300 open:bg-green-50 open:border-green-200"
              >
                <summary className="text-sm sm:text-base font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                  <span>{item.question}</span>
                  <span className="text-[#146C2D] group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMain;
