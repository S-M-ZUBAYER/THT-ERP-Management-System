import { useState } from "react";
import image from "../constants/image";
import { ChevronDown } from "lucide-react";

const Dropdown = ({ changeLanguage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState({
    en: "English",
    img: image.usa,
  });
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    {
      code: "en",
      img: `${image.usa}`,
      lng: "English",
    },
    { code: "id", img: `${image.indonesia}`, lng: "Indonesian" },
    {
      code: "cn",
      img: `${image.china}`,
      lng: "chinese",
    },
    {
      code: "vi",
      img: image.vietnam,
      lng: "Vietnamese",
    },
    {
      code: "ms",
      img: image.malaysia,
      lng: "Malay",
    },
    {
      code: "th",
      img: image.thailand,
      lng: "Thai",
    },
    {
      code: "fil",
      img: image.philippine,
      lng: "Filipino",
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        {/* Logo Section */}
        <div className="h-7 w-32">
          <img
            src={image.logo}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Language Selector */}
        <div className="relative flex items-center min-w-36 h-8 border border-[#00436899] rounded-lg">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center px-4 py-2 bg-transparent text-black rounded-md "
            aria-expanded={isOpen}
            aria-label="Toggle language selection"
          >
            <img
              src={selectedLanguage.img}
              alt="Flag"
              className="w-5 h-3 mr-2"
            />
            {selectedLanguage.en}{" "}
            <span className="ml-1">
              <ChevronDown />
            </span>
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-2 top-7 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10 px-4 py-3">
              {languages.map((language) => (
                <div
                  key={language.code}
                  className="flex items-center py-2 border-b border-cyan-300 last:border-0 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => {
                    changeLanguage(language.code);
                    setSelectedLanguage({
                      en: language.lng,
                      img: language.img,
                    });
                    setIsOpen(false);
                  }}
                >
                  <img
                    src={language.img}
                    className="w-6 mr-3"
                    alt={`${language.lng} Flag`}
                  />
                  {language.lng}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dropdown;
