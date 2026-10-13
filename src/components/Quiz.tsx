import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, HelpCircle, Database, Sparkles } from 'lucide-react';
import type { Quiz } from '../types';
import { useApp } from '../context/AppContext';
import { evaluateQuizOnPostgres } from '../lib/database';

interface QuizProps {
  quiz: Quiz;
  lessonId: string;
  courseId: string;
  onComplete?: (score: number) => void;
}

export const QuizComponent: React.FC<QuizProps> = ({
  quiz,
  lessonId,
  courseId,
  onComplete,
}) => {
  const { state, dispatch, addNotification } = useApp();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Check if previously taken
  const savedScore = state.lessonProgress.find((p) => p.lessonId === lessonId)?.quizScore;

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const [evaluatedByPostgres, setEvaluatedByPostgres] = useState(false);

  const calculateScore = async () => {
    let percentage = 0;
    let isPassed = false;
    let isBackend = false;

    try {
      // Attempt backend evaluation using PostgreSQL stored procedure
      const result = await evaluateQuizOnPostgres(
        quiz.id,
        selectedAnswers,
        state.user?.id || 'guest'
      );
      if (result && typeof result.score === 'number') {
        percentage = result.score;
        isPassed = result.passed;
        isBackend = true;
      }
    } catch {
      // Fallback to client-side evaluation if backend is not seeded with this custom quiz
      let totalPoints = 0;
      let earnedPoints = 0;

      quiz.questions.forEach((q) => {
        totalPoints += q.points;
        const selectedOptId = selectedAnswers[q.id];
        const correctOpt = q.options.find((o) => o.isCorrect);
        if (selectedOptId && correctOpt && selectedOptId === correctOpt.id) {
          earnedPoints += q.points;
        }
      });

      percentage = Math.round((earnedPoints / (totalPoints || 1)) * 100);
      isPassed = percentage >= quiz.passingScore;
    }

    setEvaluatedByPostgres(isBackend);
    setScore(percentage);
    setIsSubmitted(true);

    // Update lesson progress
    dispatch({
      type: 'UPDATE_LESSON_PROGRESS',
      payload: {
        userId: state.user?.id || 'guest',
        lessonId,
        courseId,
        completed: isPassed,
        completedAt: new Date().toISOString(),
        quizScore: percentage,
        timeSpent: 180,
      },
    });

    if (isPassed) {
      addNotification('success', `ยินดีด้วย! คุณผ่านแบบทดสอบด้วยคะแนน ${percentage}% (+${percentage === 100 ? '40' : '25'} XP)`);
      if (percentage === 100) {
        dispatch({
          type: 'ADD_ACHIEVEMENT',
          payload: {
            userId: state.user?.id || 'guest',
            achievementId: 'ach-quiz-perfect',
            unlockedAt: new Date().toISOString(),
          },
        });
      }
      onComplete?.(percentage);
    } else {
      addNotification('warning', `คุณได้ ${percentage}% (เกณฑ์ผ่าน ${quiz.passingScore}%) สามารถลองทำใหม่อีกครั้งได้`);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(null);
  };

  const allAnswered = quiz.questions.every((q) => selectedAnswers[q.id]);

  return (
    <div
      className="card"
      style={{
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg-secondary)',
        marginTop: 'var(--space-6)',
      }}
    >
      <div className="card-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={20} color="var(--color-accent-primary)" />
            <h3 className="card-title">{quiz.title}</h3>
          </div>
          <p className="card-subtitle">{quiz.description}</p>
        </div>
        <div className="badge badge-blue">
          เกณฑ์ผ่าน: {quiz.passingScore}%
        </div>
      </div>

      {savedScore !== undefined && !isSubmitted && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            background: savedScore >= quiz.passingScore ? 'var(--color-success-muted)' : 'var(--color-warning-muted)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--space-4)',
            fontSize: 'var(--text-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>คะแนนที่เคยทำได้: <strong>{savedScore}%</strong> ({savedScore >= quiz.passingScore ? 'ผ่านแล้ว' : 'ยังไม่ผ่าน'})</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>สามารถทำซ้ำเพื่อพัฒนาคะแนนได้</span>
        </div>
      )}

      {/* Questions list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {quiz.questions.map((question, qIdx) => {
          const selectedOptionId = selectedAnswers[question.id];
          const correctOption = question.options.find((o) => o.isCorrect);

          return (
            <div
              key={question.id}
              style={{
                padding: 'var(--space-4)',
                background: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ marginBottom: 'var(--space-3)', fontWeight: 'var(--weight-semibold)', display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--color-accent-primary)' }}>ข้อ {qIdx + 1}.</span>
                <span>{question.question}</span>
              </div>

              {/* Options */}
              <div>
                {question.options.map((option, optIdx) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrectOpt = option.isCorrect;

                  let optionClass = 'quiz-option';
                  if (isSelected) optionClass += ' selected';
                  if (isSubmitted) {
                    if (isCorrectOpt) optionClass += ' correct';
                    else if (isSelected && !isCorrectOpt) optionClass += ' incorrect';
                  }

                  const labels = ['ก', 'ข', 'ค', 'ง'];

                  return (
                    <div
                      key={option.id}
                      className={optionClass}
                      onClick={() => handleSelectOption(question.id, option.id)}
                    >
                      <div className="quiz-option-marker">
                        {labels[optIdx] || optIdx + 1}
                      </div>
                      <div style={{ flex: 1, fontSize: 'var(--text-sm)' }}>
                        {option.text}
                      </div>
                      {isSubmitted && isCorrectOpt && (
                        <CheckCircle2 size={18} color="var(--color-success)" />
                      )}
                      {isSubmitted && isSelected && !isCorrectOpt && (
                        <XCircle size={18} color="var(--color-error)" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation after submit */}
              {isSubmitted && (
                <div
                  style={{
                    marginTop: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-bg-primary)',
                    borderLeft: '3px solid var(--color-info)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}
                >
                  <strong style={{ color: 'var(--color-info)' }}>คำอธิบาย: </strong>
                  {question.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Actions and Result */}
      <div
        style={{
          marginTop: 'var(--space-6)',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}
      >
        {isSubmitted ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'bold',
                  color: (score || 0) >= quiz.passingScore ? 'var(--color-success)' : 'var(--color-error)',
                }}
              >
                ผลคะแนน: {score}%
              </div>
              <span className={`badge ${ (score || 0) >= quiz.passingScore ? 'badge-green' : 'badge-red'}`}>
                {(score || 0) >= quiz.passingScore ? 'ผ่านการประเมิน' : 'ยังไม่ผ่านเกณฑ์'}
              </span>
              {evaluatedByPostgres && (
                <span className="badge badge-violet" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Database size={12} /> ประเมินผลผ่าน PostgreSQL Stored Procedure
                </span>
              )}
            </div>

            <button className="btn btn-outline" onClick={handleReset}>
              <RotateCcw size={16} /> ทำแบบทดสอบอีกครั้ง
            </button>
          </>
        ) : (
          <>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              ตอบแล้ว {Object.keys(selectedAnswers).length} จาก {quiz.questions.length} ข้อ
            </span>
            <button
              className="btn btn-primary"
              onClick={calculateScore}
              disabled={!allAnswered}
            >
              ส่งคำตอบและตรวจผล <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
