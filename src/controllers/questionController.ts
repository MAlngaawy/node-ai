import { Request, Response } from 'express';
import Question, { IQuestion } from '../models/Question';
import { User } from '../models/User';

// Extend Request type to include user property
interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

// Get all questions for a user (received questions)
export const getUserQuestions = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const questions = await Question.find({ toUser: userId })
      .populate('fromUser', 'username')
      .populate('toUser', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get questions asked by a user
export const getAskedQuestions = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const questions = await Question.find({ fromUser: userId })
      .populate('fromUser', 'username')
      .populate('toUser', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch asked questions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Send a question to a user
export const sendQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { toUserId, question, isAnonymous = false } = req.body;
    const fromUserId = req.user?.id; // From auth middleware

    // Check if target user exists
    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create the question
    const newQuestion = new Question({
      fromUser: isAnonymous ? undefined : fromUserId,
      toUser: toUserId,
      question,
      isAnonymous,
      status: 'pending'
    });

    await newQuestion.save();

    // Populate user info for response
    await newQuestion.populate('toUser', 'username');

    res.status(201).json({
      success: true,
      message: 'Question sent successfully',
      question: newQuestion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send question',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Answer a question
export const answerQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { questionId } = req.params;
    const { answer } = req.body;
    const userId = req.user?.id;

    const question = await Question.findById(questionId);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user owns this question
    if (question.toUser.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only answer questions sent to you'
      });
    }

    question.answer = answer;
    question.status = 'answered';
    question.answeredAt = new Date();

    await question.save();

    // Populate user info for response
    await question.populate('fromUser', 'username');
    await question.populate('toUser', 'username');

    res.json({
      success: true,
      message: 'Question answered successfully',
      question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to answer question',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Ignore a question
export const ignoreQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { questionId } = req.params;
    const userId = req.user?.id;

    const question = await Question.findById(questionId);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user owns this question
    if (question.toUser.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only ignore questions sent to you'
      });
    }

    question.status = 'ignored';
    await question.save();

    res.json({
      success: true,
      message: 'Question ignored successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to ignore question',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all answered questions for feed
export const getFeedQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find({ status: 'answered' })
      .populate('fromUser', 'username')
      .populate('toUser', 'username')
      .sort({ answeredAt: -1 })
      .limit(50); // Limit for performance

    res.json({
      success: true,
      questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 