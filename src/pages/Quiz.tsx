import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions, QuizAnswers } from '../data/quizData';
import { ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BRAND_NAME } from '../config/brand';

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [glassScore, setGlassScore] = useState(0);
  const [recommendedProduct, setRecommendedProduct] = useState('');
  const navigate = useNavigate();

  const questions = quizQuestions;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestion]);

  const handleAnswer = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (userAnswers: string[]) => {
    let score = 0;
    let product = 'combo';

    // Calculate Glass Skin Score
    if (userAnswers.includes("Glass Glow Skin")) score += 30;
    if (userAnswers.includes("Brighter Skin")) score += 20;
    if (userAnswers.includes("Simple Routine")) score += 10;
    if (userAnswers.includes("Hydrated Skin")) score += 15;
    if (userAnswers.includes("Normal")) score += 10;
    if (userAnswers.includes("Combination")) score += 5;

    setGlassScore(Math.min(score, 100));

    // Product Recommendation Logic
    const concern = userAnswers[1]; // Biggest concern
    const sunExposure = userAnswers[2]; // Sun exposure
    const goal = userAnswers[3]; // Goal

    if (
      concern === "Sun Damage" ||
      sunExposure === "Very often" ||
      goal === "Sun Protection"
    ) {
      product = "sunscreen";
    } else if (
      concern === "Dull Skin" ||
      concern === "Dark Spots / Pigmentation" ||
      goal === "Brighter Skin" ||
      goal === "Glass Glow Skin"
    ) {
      product = "serum";
    } else {
      product = "combo";
    }

    setRecommendedProduct(product);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setGlassScore(0);
    setRecommendedProduct('');
  };

  const goToQuestion = (index: number) => {
    if (index <= answers.length) {
      setCurrentQuestion(index);
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            <div className="mb-8">
              <Sparkles className="w-16 h-16 text-pink-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Your Glass Skin Score
              </h1>
              <div className="text-6xl font-bold text-pink-600 mb-4">
                {glassScore} / 100
              </div>
              <p className="text-xl text-gray-600 mb-8">
                Your personalized skincare routine is ready
              </p>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Your Personalized Skincare Routine
              </h2>
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <span className="text-lg">Cleanse your skin with gentle cleanser</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <span className="text-lg">Apply Rice Brightening Serum</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <span className="text-lg">Protect with Sunscreen Spray SPF50</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Recommended Product
              </h3>
              {recommendedProduct === "serum" && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {BRAND_NAME} Rice Brightening Serum
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Powerful brightening with Niacinamide and Rice Extract for that glass glow skin effect.
                  </p>
                  <Link
                    to="/product/2"
                    className="inline-block bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              )}
              {recommendedProduct === "sunscreen" && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {BRAND_NAME} Sunscreen Spray SPF50
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Lightweight sun protection with UVA/UVB coverage for daily use.
                  </p>
                  <Link
                    to="/product/1"
                    className="inline-block bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              )}
              {recommendedProduct === "combo" && (
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {BRAND_NAME} Glow Combo Pack
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Complete skincare routine with both serum and sunscreen for best results.
                  </p>
                  <Link
                    to="/product/3"
                    className="inline-block bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors"
                  >
                    View Combo
                  </Link>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Retake Quiz
              </button>
              <Link
                to="/shop"
                className="bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors text-center"
              >
                Shop All Products
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 md:py-12 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-8"
        >
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Skincare Quiz
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Discover your perfect {BRAND_NAME} routine
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center mb-6 md:mb-8">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                  index === currentQuestion
                    ? "bg-pink-500 w-8"
                    : index < answers.length
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
                disabled={index > answers.length}
              />
            ))}
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl md:text-6xl mb-4">
                {questions[currentQuestion].icon}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">
                {questions[currentQuestion].question}
              </h2>

              {/* Options */}
              <div className="space-y-3 max-w-md mx-auto">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full py-3 px-4 md:py-4 md:px-6 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all duration-200 text-left font-medium text-gray-800 text-sm md:text-base"
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Quiz;
