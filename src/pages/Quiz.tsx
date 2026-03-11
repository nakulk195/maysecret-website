import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions, QuizAnswers } from '../data/quizData';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BRAND_NAME } from '../config/brand';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeSlide = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const Quiz: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const total = quizQuestions.length;
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const progress = Math.round(((step) / total) * 100);

  const current = quizQuestions[step] ?? null;

  const canNext = current ? Boolean(answers[current.id]) : false;

  const selectOption = (qid: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const onNext = () => {
    if (step < total - 1) setStep(s => s + 1);
  };

  const onPrev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  // {BRAND_NAME} product recommendation logic
  const recommendation = useMemo(() => {
    const concern = answers['concern'];
    const sunExposure = answers['sun_exposure'];
    const goal = answers['goal'];
    const skinType = answers['skin_type'];

    let result = {
      id: 'combo',
      name: `${BRAND_NAME} Combo Pack`,
      description: 'Complete skincare routine for best results',
      image: '/images/combo-pack.png',
      href: '/combo',
      benefits: [
        'Complete skincare solution',
        'Brightens and protects skin',
        'Suitable for all skin types',
        'Best value for money'
      ]
    };

    // Sun protection logic
    if (
      concern === "Sun Damage" ||
      sunExposure === "Very often" ||
      goal === "Sun Protection"
    ) {
      result = {
        id: 'sunscreen',
        name: `${BRAND_NAME} Sunscreen Spray SPF50 PA+++`,
        description: 'Lightweight sun protection for daily use',
        image: '/images/sunscreen-spray.png',
        href: '/product/sunscreen',
        benefits: [
          'SPF 50+ broad spectrum protection',
          'Lightweight non-greasy formula',
          'Suitable for all skin types',
          'Water and sweat resistant'
        ]
      };
    }
    // Brightening logic
    else if (
      concern === "Dull Skin" ||
      concern === "Dark Spots / Pigmentation" ||
      goal === "Brighter Skin" ||
      goal === "Glass Glow Skin"
    ) {
      result = {
        id: 'serum',
        name: `${BRAND_NAME} Rice Brightening Serum`,
        description: 'Powerful brightening with Niacinamide and Rice Extract',
        image: '/images/rice-brightening-serum.png',
        href: '/product/serum',
        benefits: [
          'Brightens dull skin',
          'Improves skin tone',
          'Boosts natural glow',
          'Hydrates and nourishes'
        ]
      };
    }

    return result;
  }, [answers]);

  const onFinish = () => {
    setStep(total); // go to result panel
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            <span style={{ fontFamily: 'Playfair Display, serif' }}>Skin Quiz</span>
            <span className="ml-3 text-pink-600 font-medium" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
              피부 테스트
            </span>
          </motion.h1>
          <p className="text-gray-600 mt-2">Discover your personalized routine in under a minute.</p>
        </div>

        {/* Progress Bar */}
        {step < total && (
          <div className="mb-8">
            <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
                className="h-full bg-pink-500"
              />
            </div>
            <div className="text-right text-sm text-gray-500 mt-1">{progress}% complete</div>
          </div>
        )}

        {/* Question Panel */}
        <AnimatePresence mode="wait">
          {step < total && current && (
            <motion.div
              key={current.id}
              variants={fadeSlide}
              initial="hidden"
              animate="show"
              exit="exit"
              className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 md:p-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {current.title}
                </h2>
                {current.subtitle && (
                  <p className="text-pink-600 mt-1" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{current.subtitle}</p>
                )}
              </div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5"
              >
                {current.options.map((opt) => {
                  const active = answers[current.id] === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectOption(current.id, opt.value)}
                      className={`group rounded-2xl overflow-hidden border transition-all text-left ${
                        active ? 'border-pink-500 ring-2 ring-pink-200' : 'border-rose-100 hover:border-pink-300'
                      }`}
                    >
                      <div className="aspect-[16/10] w-full overflow-hidden bg-rose-50">
                        <img src={opt.image} alt={opt.label} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <span className="font-medium text-gray-800">{opt.label}</span>
                        {active && <CheckCircle className="text-pink-500" size={20} />}
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Nav */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={onPrev}
                  disabled={step === 0}
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ArrowLeft size={18} className="mr-2" /> Back
                </button>
                {step < total - 1 ? (
                  <button
                    onClick={onNext}
                    disabled={!canNext}
                    className="inline-flex items-center px-5 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50"
                  >
                    Next <ArrowRight size={18} className="ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={onFinish}
                    disabled={!canNext}
                    className="inline-flex items-center px-5 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50"
                  >
                    See Result <Sparkles size={18} className="ml-2" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Panel */}
        <AnimatePresence>
          {step >= total && (
            <motion.div
              key="result"
              variants={fadeSlide}
              initial="hidden"
              animate="show"
              exit="exit"
              className="bg-white rounded-2xl shadow-lg border border-rose-100 p-6 md:p-8 mt-8"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  ✨ Your Skin Match
                </h3>
                <p className="text-pink-600" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                  당신에게 완벽한 제품
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Product Image */}
                <div className="rounded-2xl overflow-hidden bg-rose-50 shadow-lg">
                  <img 
                    src={recommendation.image} 
                    alt={recommendation.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>

                {/* Product Details */}
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">
                    {recommendation.name}
                  </h4>
                  <p className="text-gray-600 mb-6 text-lg">
                    {recommendation.description}
                  </p>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-3">Benefits:</h5>
                    <ul className="space-y-2">
                      {recommendation.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link 
                      to={recommendation.href} 
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition duration-300 font-semibold"
                    >
                      View Product
                    </Link>
                    <button 
                      onClick={() => navigate('/shop')} 
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition duration-300 font-semibold"
                    >
                      Browse More
                    </button>
                  </div>
                </div>
              </div>

              {/* Restart Quiz */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => {
                    setStep(0);
                    setAnswers({});
                  }}
                  className="text-pink-600 hover:text-pink-700 font-medium transition duration-200"
                >
                  Take Quiz Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
