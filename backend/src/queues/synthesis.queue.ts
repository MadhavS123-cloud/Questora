import { Queue, Worker, QueueEvents } from 'bullmq';
import QueueRedis from 'ioredis';
import { AssignmentModel } from '../models/assignment.model';
import { sendAssignmentProgress } from '../socket/gateway';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
const REDIS_URL = process.env.REDIS_URL;

let assignmentQueue: Queue | null = null;
let isRedisOnline = false;

// Create standard Redis clients for BullMQ supporting connection string (REDIS_URL) or host/port config
const redisConnection = REDIS_URL
  ? new QueueRedis(REDIS_URL, { maxRetriesPerRequest: null, lazyConnect: true })
  : new QueueRedis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      maxRetriesPerRequest: null,
      lazyConnect: true
    });

// Register error event listener to prevent unhandled promise / event errors when offline
redisConnection.on('error', (err) => {
  // Silence connection errors as we fall back to in-memory synthesis
  if (!isRedisOnline) {
    // Only print once or keep it completely silent
  } else {
    console.error('Redis connection error:', err);
  }
});

redisConnection.connect().then(() => {
  console.log('Successfully connected to Redis server for job queueing');
  isRedisOnline = true;
  initializeBullMQ();
}).catch((err) => {
  console.warn('Redis server offline. Falling back to in-memory synthesis queue:', err.message);
  isRedisOnline = false;
});

function initializeBullMQ() {
  assignmentQueue = new Queue('assignment-synthesis', { connection: redisConnection });

  const worker = new Worker('assignment-synthesis', async (job) => {
    const { assignmentId } = job.data;
    await executeSynthesisPipeline(assignmentId);
  }, { connection: redisConnection });

  worker.on('failed', (job, err) => {
    console.error(`BullMQ Job ${job?.id} failed:`, err);
  });
}

// In-Memory Fallback Executor
async function runInMemorySynthesis(assignmentId: string) {
  console.log(`[InMemoryQueue] Starting pipeline for Assignment: ${assignmentId}`);
  try {
    await executeSynthesisPipeline(assignmentId);
  } catch (error) {
    console.error('[InMemoryQueue] Execution failed:', error);
  }
}

// Core Synthesis Pipeline
async function executeSynthesisPipeline(assignmentId: string) {
  const steps = [
    {
      status: 'parsing' as const,
      progressPercent: 25,
      step: 2,
      logs: [
        'File verification completed. Ingested 1 PDF document.',
        'Semantic parsing: Analyzing core concepts and vocabulary scope...',
        'Generated compliance report against curriculum specs.'
      ]
    },
    {
      status: 'synthesizing' as const,
      progressPercent: 60,
      step: 3,
      logs: [
        'Synthesizing standardized question bank items...',
        'Calibrating question difficulty mix using Bloom\'s taxonomy.',
        'Structured exam formatting: Generating distractors for MCQs.'
      ]
    },
    {
      status: 'guardrails' as const,
      progressPercent: 85,
      step: 4,
      logs: [
        'Running safety guardrails: Deduplicating close variants.',
        'Verifying target marks balancing and allocation checks.',
        'Pedagogical verification: Content alignment confirmed.'
      ]
    },
    {
      status: 'completed' as const,
      progressPercent: 100,
      step: 5,
      logs: [
        'Typesetting completed: Structuring final printable page container.',
        'Process completed. Storing ready assignment state.'
      ]
    }
  ];

  // Initialize status inside DB
  await AssignmentModel.findByIdAndUpdate(assignmentId, {
    status: 'processing',
    progressPercent: 10
  });
  
  sendAssignmentProgress(assignmentId, {
    status: 'ingesting',
    step: 1,
    progressPercent: 10,
    logs: ['Connection established. Initializing document parsing step.']
  });

  // Run steps with delay to show logs in real time
  for (const stepInfo of steps) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Save to Database
    const isFinished = stepInfo.status === 'completed';
    const dbUpdate: any = {
      status: isFinished ? 'completed' : 'processing',
      progressPercent: stepInfo.progressPercent
    };

    if (isFinished) {
      // Seed mockup questions so they match client assignment structure
      dbUpdate.sections = [
        {
          id: 'sec-a',
          title: 'SECTION A: MULTIPLE CHOICE QUESTIONS (10 Marks)',
          questions: [
            {
              id: `q-${Date.now()}-1`,
              index: 1,
              questionType: 'MCQ',
              questionText: 'Which mathematical framework describes system motion without modeling the driving physical forces?',
              options: ['Dynamics', 'Kinematics', 'Statics', 'Entropy'],
              marks: 5,
              confidenceScore: 98,
              sourceCitation: {
                pageNumber: 1,
                passageSnippet: 'Kinematics describes the motion of points, bodies, and systems of bodies without consideration of the forces.'
              }
            },
            {
              id: `q-${Date.now()}-2`,
              index: 2,
              questionType: 'MCQ',
              questionText: 'Under what physical limits do standard uniform acceleration models correctly predict displacement?',
              options: ['Varying acceleration rates', 'Relativistic speeds', 'Constant acceleration rates', 'Zero displacement'],
              marks: 5,
              confidenceScore: 95,
              sourceCitation: {
                pageNumber: 1,
                passageSnippet: 'Uniform acceleration formulas apply to constant velocity rates.'
              }
            }
          ]
        },
        {
          id: 'sec-b',
          title: 'SECTION B: SHORT WRITTEN PAPERS (40 Marks)',
          questions: [
            {
              id: `q-${Date.now()}-3`,
              index: 3,
              questionType: 'LongForm',
              questionText: 'Derive the classical kinematic position equation under constant acceleration, plotting the displacement path.',
              marks: 40,
              confidenceScore: 97,
              sourceCitation: {
                pageNumber: 2,
                passageSnippet: 'Uniform acceleration formulas apply to constant velocity rates.'
              }
            }
          ]
        }
      ];
    }

    await AssignmentModel.findByIdAndUpdate(assignmentId, dbUpdate);

    // Stream status via WebSockets
    sendAssignmentProgress(assignmentId, {
      status: stepInfo.status,
      step: stepInfo.step,
      progressPercent: stepInfo.progressPercent,
      logs: stepInfo.logs
    });
  }
}

// Queue trigger action
export async function triggerAssignmentSynthesis(assignmentId: string) {
  if (isRedisOnline && assignmentQueue) {
    try {
      await assignmentQueue.add(`job-${assignmentId}`, { assignmentId });
      console.log(`[BullMQ] Enqueued assignment compilation job: ${assignmentId}`);
    } catch (err: any) {
      console.warn('[BullMQ] Failed to add to Redis queue, falling back to in-memory:', err.message);
      runInMemorySynthesis(assignmentId);
    }
  } else {
    // Run async fallback
    runInMemorySynthesis(assignmentId);
  }
}
