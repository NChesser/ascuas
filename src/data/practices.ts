import {
  Brain,
  Calendar,
  Eye,
  HandHeart,
  Handshake,
  Heart,
  Leaf,
  Lightbulb,
  MessageCircle,
  MessageSquare,
  Mic,
  Phone,
  Send,
  Shield,
  Smile,
  Sparkles,
  SunMedium,
  ThumbsUp,
  Users,
} from 'lucide-react-native';
import type { Practice } from '../types/types';

// ── Social ───────────────────────────────────────────────────

const SOCIAL: Practice[] = [
  {
    id: 'brief-eye-contact',
    title: 'Brief Eye Contact',
    description: 'Hold eye contact for a second to signal friendliness',
    icon: Eye,
    category: 'social',
    hint: 'Catch their eye as you walk past \u2014 a quick glance and a micro-smile is all it takes. Look at the bridge of their nose if direct eye contact feels too intense.',
  },
  {
    id: 'warm-greeting',
    title: 'Warm Greeting',
    description: 'Say hello with a relaxed smile to one person',
    icon: Smile,
    category: 'social',
    hint: "Pick someone who looks approachable \u2014 someone waiting, walking slowly, or already glancing your way. A simple \"hey\" with a nod works perfectly.",
  },
  {
    id: 'start-small-chat',
    title: 'Start a Small Chat',
    description: 'Open a short conversation with one simple question',
    icon: MessageCircle,
    category: 'social',
    hint: 'Use your surroundings as a starter \u2014 comment on the weather, the queue, or something nearby. People are more receptive when they are idle (waiting, sitting alone).',
  },
  {
    id: 'add-comment',
    title: 'Add One Comment',
    description: 'Contribute one sentence in a group setting',
    icon: MessageSquare,
    category: 'social',
    hint: 'You don\'t need something brilliant \u2014 agreeing, asking a short question, or reacting ("That\'s cool!") all count. Aim for the next natural pause.',
  },
  {
    id: 'follow-up',
    title: 'Follow Up',
    description: 'Send a simple follow-up to deepen a connection',
    icon: Send,
    category: 'social',
    hint: 'A quick message the same day or next morning keeps momentum. Reference something specific from the chat so they know you were listening.',
  },
  {
    id: 'speak-up-in-group',
    title: 'Speak Up in a Group',
    description: 'Share your opinion or an idea in a group of three or more',
    icon: Mic,
    category: 'social',
    hint: "Start with agreement (\"Yeah, I think so too\") then add one extra thought. Speaking early is easier than waiting \u2014 the longer you wait, the harder it feels.",
  },
];

// ── Connection ───────────────────────────────────────────────

const CONNECTION: Practice[] = [
  {
    id: 'give-compliment',
    title: 'Give a Genuine Compliment',
    description: 'Notice something positive and say it out loud',
    icon: ThumbsUp,
    category: 'connection',
    hint: "Be specific \u2014 \"Great shirt\" lands better than \"You look nice.\" Deliver it casually and move on; lingering makes it awkward for both of you.",
  },
  {
    id: 'active-listening',
    title: 'Practice Active Listening',
    description: 'Focus fully on what someone is saying without planning your reply',
    icon: HandHeart,
    category: 'connection',
    hint: 'Put your phone away, face them, and nod. When they finish, reflect back what you heard ("So you\'re saying...") before adding your own thought.',
  },
  {
    id: 'reconnect-old-friend',
    title: 'Reconnect with Someone',
    description: "Reach out to someone you haven't spoken to in a while",
    icon: Phone,
    category: 'connection',
    hint: 'Don\'t overthink the opening \u2014 "Hey! Been thinking of you, how have you been?" is enough. Sharing a memory or a relevant link makes it feel natural.',
  },
];

// ── Growth ───────────────────────────────────────────────────

const GROWTH: Practice[] = [
  {
    id: 'approach-interest',
    title: 'Approach Someone You Like',
    description: 'Say a friendly hello to someone you are interested in',
    icon: Heart,
    category: 'growth',
    hint: "Approach when they're not rushed or buried in their phone. Open with something situational (\"Is this seat taken?\" / \"Have you tried the...?\") rather than a rehearsed line. Keep it light \u2014 the goal is just to say hi, not to impress.",
  },
  {
    id: 'share-small-detail',
    title: 'Share a Small Detail',
    description: 'Offer one personal detail to build connection',
    icon: Sparkles,
    category: 'growth',
    hint: "Match the depth of what they've shared. If they mention their weekend, share something about yours. One genuine detail beats three surface-level facts.",
  },
  {
    id: 'handle-no',
    title: 'Handle a No Gracefully',
    description: 'Practice a calm response to a no or maybe',
    icon: Shield,
    category: 'growth',
    hint: 'Prepare a go-to response before you need it \u2014 "No worries at all!" said with a smile. A graceful exit makes you more approachable next time.',
  },
  {
    id: 'low-key-invite',
    title: 'Low-Key Invite',
    description: 'Invite someone to a simple, low-pressure hangout',
    icon: Calendar,
    category: 'growth',
    hint: "Suggest something specific with an easy out \u2014 \"I'm grabbing coffee at 3, want to come?\" feels lighter than \"We should hang out sometime.\" A time and place removes ambiguity.",
  },
  {
    id: 'ask-deeper-question',
    title: 'Ask a Deeper Question',
    description: 'Go beyond small talk with one thoughtful question',
    icon: Lightbulb,
    category: 'growth',
    hint: 'Follow up on something they already mentioned \u2014 "What got you into that?" or "What\'s been the best part?" People love talking about their passions.',
  },
  {
    id: 'join-group-activity',
    title: 'Join a Group Activity',
    description: 'Show up to a club, class, or event with other people',
    icon: Users,
    category: 'growth',
    hint: "Arrive a few minutes early \u2014 it's easier to chat before things start. You only need to stay as long as you want. Just showing up is a win.",
  },
];

// ── Mindset ──────────────────────────────────────────────────

const MINDSET: Practice[] = [
  {
    id: 'reframe-thought',
    title: 'Reframe a Negative Thought',
    description: 'Catch one anxious thought and rephrase it more kindly',
    icon: Brain,
    category: 'mindset',
    hint: 'Write the anxious thought down, then ask "Would I say this to a friend?" Rewrite it as if you were encouraging someone you care about.',
  },
  {
    id: 'morning-intention',
    title: 'Set a Morning Intention',
    description: 'Choose one small social goal before your day begins',
    icon: SunMedium,
    category: 'mindset',
    hint: "Keep it tiny and specific \u2014 \"I'll smile at one person on my walk\" beats \"I'll be more social today.\" Write it on a sticky note or set a phone reminder.",
  },
];

// ── Wellbeing ────────────────────────────────────────────────

const WELLBEING: Practice[] = [
  {
    id: 'reset-before-social',
    title: 'Reset Before Social',
    description: 'Take a 2-minute reset to feel grounded',
    icon: Leaf,
    category: 'wellbeing',
    hint: 'Step outside, take five slow breaths, and relax your shoulders. Arriving calm makes everything easier.',
  },
  {
    id: 'celebrate-small-win',
    title: 'Celebrate a Small Win',
    description: 'Acknowledge one thing you did well socially today',
    icon: Handshake,
    category: 'wellbeing',
    hint: "Saying hi counts. Making eye contact counts. Showing up counts. Name it out loud or write it down \u2014 your brain learns from what you notice.",
  },
];

// ── Export ────────────────────────────────────────────────────

export const PRACTICES: Practice[] = [
  ...SOCIAL,
  ...CONNECTION,
  ...GROWTH,
  ...MINDSET,
  ...WELLBEING,
];
