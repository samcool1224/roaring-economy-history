import { useMemo, useState } from 'react';
import { questionsForExhibit, type ChoiceKey } from '../data/questions';
import { sfx } from '../audio/sfx';

interface Props {
  exhibitId: number;
  answered: Record<string, boolean>;
  onAnswer: (questionId: string, correct: boolean) => void;
  onResetQuiz: () => void;
  onReviewLesson: () => void;
}

/**
 * Check for Understanding — four questions, four choices each, one at a time.
 *
 * Rule: a wrong answer ends the attempt. The quiz clears and restarts from
 * question 1. There is no time limit and no cap on attempts, and the visitor can
 * jump back into the lesson before trying again.
 */
export default function CFU({
  exhibitId,
  answered,
  onAnswer,
  onResetQuiz,
  onReviewLesson,
}: Props) {
  const questions = useMemo(() => questionsForExhibit(exhibitId), [exhibitId]);
  const firstUnanswered = questions.findIndex((q) => !answered[q.id]);
  const [index, setIndex] = useState(firstUnanswered === -1 ? 0 : firstUnanswered);
  const [picked, setPicked] = useState<ChoiceKey | null>(null);
  const [failed, setFailed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempt, setAttempt] = useState(1);

  const q = questions[index];
  if (!q) return null;

  const alreadyRight = !!answered[q.id];
  const justRight = picked !== null && picked === q.correct;
  const correctCount = questions.filter((x) => answered[x.id]).length;
  const allDone = correctCount === questions.length;

  const choose = (key: ChoiceKey) => {
    if (alreadyRight || failed || justRight) return;
    setPicked(key);
    if (key === q.correct) {
      onAnswer(q.id, true);
      sfx.play('chime');
    } else {
      // Attempt over — clear the whole quiz and send them back to the start.
      setFailed(true);
      onResetQuiz();
      sfx.play('wrong');
    }
  };

  const restart = () => {
    setFailed(false);
    setPicked(null);
    setShowHint(false);
    setIndex(0);
    setAttempt((a) => a + 1);
  };

  const next = () => {
    setPicked(null);
    setShowHint(false);
    setIndex((i) => Math.min(i + 1, questions.length - 1));
  };

  /* ------------------------------------------------ failed attempt screen */
  if (failed) {
    return (
      <section className="cfu cfu--failed" aria-label="Check for understanding">
        <div className="cfu-fail-card" role="status">
          <span className="cfu-fail-mark" aria-hidden="true">
            ✕
          </span>
          <h3>That answer was not correct</h3>
          <p>
            This quiz restarts from question 1. Your reading and your activity are still
            saved — only the questions reset.
          </p>
          <p className="cfu-fail-sub">
            You reached question {index + 1} of {questions.length}. There is no limit on
            attempts, so take another look at the lesson first if it helps.
          </p>
          <div className="cfu-fail-actions">
            <button className="btn btn-primary" onClick={restart}>
              Start the quiz again
            </button>
            <button className="btn btn-ghost" onClick={onReviewLesson}>
              Review the lesson first
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------- normal flow */
  return (
    <section className="cfu" aria-label="Check for understanding">
      <header className="cfu-head">
        <div>
          <span className="cfu-counter">
            Question {index + 1} of {questions.length}
            {attempt > 1 && <span className="cfu-attempt">attempt {attempt}</span>}
          </span>
          <h3 className="cfu-title">Check for Understanding</h3>
        </div>
        <div className="cfu-dots" role="list" aria-label="Question progress">
          {questions.map((x, i) => (
            <span
              key={x.id}
              role="listitem"
              className={`cfu-dot${answered[x.id] ? ' is-correct' : ''}${i === index ? ' is-current' : ''}`}
              aria-label={`Question ${i + 1}${answered[x.id] ? ', answered correctly' : ', not yet answered'}`}
            >
              {answered[x.id] ? '✓' : i + 1}
            </span>
          ))}
        </div>
      </header>

      <p className="cfu-warning">
        One wrong answer restarts the quiz from question 1, so read each option carefully.
      </p>

      <p className="cfu-prompt">{q.prompt}</p>

      <ul className="cfu-choices">
        {q.choices.map((c) => {
          const chosen = picked === c.key;
          const revealCorrect = (chosen || alreadyRight) && c.key === q.correct;
          return (
            <li key={c.key}>
              <button
                className={`cfu-choice${revealCorrect ? ' is-correct' : ''}`}
                onClick={() => choose(c.key)}
                disabled={alreadyRight || justRight}
                aria-pressed={chosen}
              >
                <span className="cfu-key">{c.key}</span>
                <span>{c.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {!justRight && !alreadyRight && (
        <div className="cfu-helpers">
          <button className="btn btn-small btn-ghost" onClick={() => setShowHint((h) => !h)}>
            {showHint ? 'Hide hint' : 'Show a hint'}
          </button>
          <button className="btn btn-small btn-ghost" onClick={onReviewLesson}>
            Review the lesson
          </button>
        </div>
      )}

      {showHint && !justRight && !alreadyRight && <p className="cfu-hint">Hint: {q.hint}</p>}

      {(justRight || alreadyRight) && (
        <div className="cfu-feedback is-correct" role="status">
          <strong>Correct</strong>
          <p>{q.whyCorrect}</p>
        </div>
      )}

      <footer className="cfu-foot">
        <span className="cfu-score">
          {correctCount} of {questions.length} answered
          {allDone ? ' — quiz complete.' : ' in this attempt.'}
        </span>
        {(justRight || alreadyRight) && !allDone && (
          <button className="btn btn-primary" onClick={next}>
            Next question →
          </button>
        )}
      </footer>
    </section>
  );
}
