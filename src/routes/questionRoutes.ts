import { Router } from 'express';
import { 
  getUserQuestions, 
  getAskedQuestions, 
  sendQuestion, 
  answerQuestion, 
  ignoreQuestion, 
  getFeedQuestions 
} from '../controllers/questionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         fromUser:
 *           type: string
 *           description: User ID who asked the question (null if anonymous)
 *         toUser:
 *           type: string
 *           description: User ID who received the question
 *         question:
 *           type: string
 *           description: The question text
 *         answer:
 *           type: string
 *           description: The answer text (if answered)
 *         isAnonymous:
 *           type: boolean
 *           description: Whether the question was asked anonymously
 *         status:
 *           type: string
 *           enum: [pending, answered, ignored]
 *           description: Current status of the question
 *         createdAt:
 *           type: string
 *           format: date-time
 *         answeredAt:
 *           type: string
 *           format: date-time
 *           description: When the question was answered
 *     SendQuestionRequest:
 *       type: object
 *       required:
 *         - toUserId
 *         - question
 *       properties:
 *         toUserId:
 *           type: string
 *           description: ID of the user to send question to
 *         question:
 *           type: string
 *           description: The question text
 *         isAnonymous:
 *           type: boolean
 *           default: false
 *           description: Whether to send anonymously
 *     AnswerQuestionRequest:
 *       type: object
 *       required:
 *         - answer
 *       properties:
 *         answer:
 *           type: string
 *           description: The answer text
 */

/**
 * @swagger
 * /api/questions/user/{userId}:
 *   get:
 *     summary: Get all questions received by a user
 *     description: Retrieve all questions sent to a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Questions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 questions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       500:
 *         description: Server error
 */
router.get('/user/:userId', getUserQuestions);

/**
 * @swagger
 * /api/questions/asked/{userId}:
 *   get:
 *     summary: Get all questions asked by a user
 *     description: Retrieve all questions asked by a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Asked questions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 questions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       500:
 *         description: Server error
 */
router.get('/asked/:userId', getAskedQuestions);

/**
 * @swagger
 * /api/questions/send:
 *   post:
 *     summary: Send a question to a user
 *     description: Send a question to another user (anonymous or named)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendQuestionRequest'
 *     responses:
 *       201:
 *         description: Question sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 question:
 *                   $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Target user not found
 *       500:
 *         description: Server error
 */
router.post('/send', authenticateToken, sendQuestion);

/**
 * @swagger
 * /api/questions/{questionId}/answer:
 *   post:
 *     summary: Answer a question
 *     description: Answer a question that was sent to you
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnswerQuestionRequest'
 *     responses:
 *       200:
 *         description: Question answered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 question:
 *                   $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You can only answer questions sent to you
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.post('/:questionId/answer', authenticateToken, answerQuestion);

/**
 * @swagger
 * /api/questions/{questionId}/ignore:
 *   post:
 *     summary: Ignore a question
 *     description: Mark a question as ignored (only the question owner can do this)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The question ID
 *     responses:
 *       200:
 *         description: Question ignored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You can only ignore questions sent to you
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.post('/:questionId/ignore', authenticateToken, ignoreQuestion);

/**
 * @swagger
 * /api/questions/feed:
 *   get:
 *     summary: Get feed of answered questions
 *     description: Get all answered questions for the main feed
 *     responses:
 *       200:
 *         description: Feed retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 questions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       500:
 *         description: Server error
 */
router.get('/feed', getFeedQuestions);

export default router; 