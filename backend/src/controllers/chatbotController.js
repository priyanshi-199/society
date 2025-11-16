const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// Knowledge base with English support only
const knowledgeBase = {
  // Notices related queries
  notices: {
    patterns: ['notice', 'notices', 'announcement', 'announcements', 'create notice', 'post notice', 'view notices', 'how to create notice'],
    responses: {
      owner: 'To view notices:\n1. Click on "Notices" in the sidebar\n2. You will see all notices posted by committee/admin\n3. Pinned notices appear at the top\n\nNote: Only committee members and admins can create notices.',
      tenant: 'To view notices:\n1. Click on "Notices" in the sidebar\n2. You will see all notices posted by committee/admin\n3. Pinned notices appear at the top\n\nNote: Only committee members and admins can create notices.',
      committee: 'To create a notice:\n1. Go to "Notices" page from sidebar\n2. Click "Create Notice" button\n3. Fill in the title and content\n4. Select audience (All, Owners, Tenants, or Security)\n5. Optionally pin the notice\n6. Click "Submit" to post\n\nTo view notices, simply click on "Notices" in the sidebar.',
      admin: 'To create a notice:\n1. Go to "Notices" page from sidebar\n2. Click "Create Notice" button\n3. Fill in the title and content\n4. Select audience (All, Owners, Tenants, or Security)\n5. Optionally pin the notice\n6. Click "Submit" to post\n\nTo view notices, simply click on "Notices" in the sidebar.',
      security: 'To view notices:\n1. Click on "Notices" in the sidebar\n2. You will see all notices posted by committee/admin\n3. Pinned notices appear at the top',
    },
  },
  // Maintenance related queries
  maintenance: {
    patterns: ['maintenance', 'bill', 'bills', 'maintenance bill', 'pay maintenance', 'view bills', 'create bill', 'maintenance payment'],
    responses: {
      owner: 'To view your maintenance bills:\n1. Click on "Maintenance" in the sidebar\n2. You will see all your bills with amounts and due dates\n3. To pay a bill, go to "Payments" page\n4. Select the bill and enter transaction ID\n5. Click "Initiate Payment"',
      tenant: 'To view your maintenance bills:\n1. Click on "Maintenance" in the sidebar\n2. You will see all your bills with amounts and due dates\n3. To pay a bill, go to "Payments" page\n4. Select the bill and enter transaction ID\n5. Click "Initiate Payment"',
      committee: 'To create a maintenance bill:\n1. Go to "Maintenance" page from sidebar\n2. Click "Create Bill" button\n3. Select the owner/tenant\n4. Enter period start and end dates\n5. Enter total amount and due date\n6. Fill in breakdown (maintenance, parking, sinking fund, other)\n7. Click "Submit"\n\nTo view bills, go to "Maintenance" page.',
      admin: 'To create a maintenance bill:\n1. Go to "Maintenance" page from sidebar\n2. Click "Create Bill" button\n3. Select the owner/tenant\n4. Enter period start and end dates\n5. Enter total amount and due date\n6. Fill in breakdown (maintenance, parking, sinking fund, other)\n7. Click "Submit"\n\nTo view bills, go to "Maintenance" page.',
      security: 'Maintenance bills are managed by committee and admin. Security staff can view notices related to maintenance.',
    },
  },
  // Complaints related queries
  complaints: {
    patterns: ['complaint', 'complaints', 'file complaint', 'submit complaint', 'view complaints', 'complaint status', 'how to file complaint'],
    responses: {
      owner: 'To file a complaint:\n1. Go to "Complaints" page from sidebar\n2. Click "File Complaint" button\n3. Enter subject and description\n4. Select category (maintenance, security, other)\n5. Click "Submit"\n\nTo view your complaints and their status, go to "Complaints" page.',
      tenant: 'To file a complaint:\n1. Go to "Complaints" page from sidebar\n2. Click "File Complaint" button\n3. Enter subject and description\n4. Select category (maintenance, security, other)\n5. Click "Submit"\n\nTo view your complaints and their status, go to "Complaints" page.',
      committee: 'To view and manage complaints:\n1. Go to "Complaints" page from sidebar\n2. You can see all complaints from residents\n3. Click on a complaint to view details\n4. Update status (Open, In Progress, Resolved, Rejected)\n5. You can also file complaints yourself using "File Complaint" button',
      admin: 'To view and manage complaints:\n1. Go to "Complaints" page from sidebar\n2. You can see all complaints from residents\n3. Click on a complaint to view details\n4. Update status (Open, In Progress, Resolved, Rejected)\n5. You can also file complaints yourself using "File Complaint" button',
      security: 'To file a complaint:\n1. Go to "Complaints" page from sidebar\n2. Click "File Complaint" button\n3. Enter subject and description\n4. Select category\n5. Click "Submit"',
    },
  },
  // Payments related queries
  payments: {
    patterns: ['payment', 'payments', 'pay bill', 'make payment', 'transaction', 'payment history', 'how to pay'],
    responses: {
      owner: 'To make a payment:\n1. Go to "Payments" page from sidebar\n2. Click "Initiate Payment" button\n3. Select the maintenance bill you want to pay\n4. Enter your transaction ID from payment gateway\n5. Click "Initiate Payment"\n\nTo view payment history, go to "Payments" page.',
      tenant: 'To make a payment:\n1. Go to "Payments" page from sidebar\n2. Click "Initiate Payment" button\n3. Select the maintenance bill you want to pay\n4. Enter your transaction ID from payment gateway\n5. Click "Initiate Payment"\n\nTo view payment history, go to "Payments" page.',
      committee: 'To view payments:\n1. Go to "Payments" page from sidebar\n2. You can see all payment transactions\n3. Payments show status (Initiated, Successful, Failed, Refunded)\n4. You can verify payments using transaction IDs',
      admin: 'To view payments:\n1. Go to "Payments" page from sidebar\n2. You can see all payment transactions\n3. Payments show status (Initiated, Successful, Failed, Refunded)\n4. You can verify payments using transaction IDs',
      security: 'Payments are handled by owners and tenants. Security staff can view notices related to payments.',
    },
  },
  // Polls related queries
  polls: {
    patterns: ['poll', 'polls', 'vote', 'voting', 'create poll', 'view polls', 'how to vote'],
    responses: {
      owner: 'To vote in polls:\n1. Go to "Polls" page from sidebar\n2. You will see all active polls\n3. Click on a poll to view options\n4. Select your choice and click "Vote"\n\nNote: Only committee and admin can create polls.',
      tenant: 'To vote in polls:\n1. Go to "Polls" page from sidebar\n2. You will see all active polls\n3. Click on a poll to view options\n4. Select your choice and click "Vote"\n\nNote: Only committee and admin can create polls.',
      committee: 'To create a poll:\n1. Go to "Polls" page from sidebar\n2. Click "Create Poll" button\n3. Enter the question\n4. Add options (at least 2)\n5. Set closing date (optional)\n6. Click "Submit"\n\nTo view and vote in polls, go to "Polls" page.',
      admin: 'To create a poll:\n1. Go to "Polls" page from sidebar\n2. Click "Create Poll" button\n3. Enter the question\n4. Add options (at least 2)\n5. Set closing date (optional)\n6. Click "Submit"\n\nTo view and vote in polls, go to "Polls" page.',
      security: 'To vote in polls:\n1. Go to "Polls" page from sidebar\n2. You will see all active polls\n3. Click on a poll to view options\n4. Select your choice and click "Vote"',
    },
  },
  // Visitors related queries
  visitors: {
    patterns: ['visitor', 'visitors', 'schedule visitor', 'visitor entry', 'visitor log', 'check in', 'check out'],
    responses: {
      owner: 'To schedule a visitor:\n1. Go to "Visitors" page from sidebar\n2. Click "Schedule Visitor" button\n3. Enter visitor name, phone, and purpose\n4. Select expected arrival date and time\n5. Click "Submit"\n\nTo view scheduled visitors, go to "Visitors" page.',
      tenant: 'To schedule a visitor:\n1. Go to "Visitors" page from sidebar\n2. Click "Schedule Visitor" button\n3. Enter visitor name, phone, and purpose\n4. Select expected arrival date and time\n5. Click "Submit"\n\nTo view scheduled visitors, go to "Visitors" page.',
      committee: 'To schedule a visitor:\n1. Go to "Visitors" page from sidebar\n2. Click "Schedule Visitor" button\n3. Enter visitor details\n4. Select expected arrival date and time\n5. Click "Submit"\n\nTo view all visitors, go to "Visitors" page.',
      admin: 'To schedule a visitor:\n1. Go to "Visitors" page from sidebar\n2. Click "Schedule Visitor" button\n3. Enter visitor details\n4. Select expected arrival date and time\n5. Click "Submit"\n\nTo view all visitors, go to "Visitors" page.',
      security: 'To check in/out visitors:\n1. Go to "Security Gates" page from sidebar\n2. You will see all scheduled visitors\n3. When visitor arrives, click "Check In"\n4. When visitor leaves, click "Check Out"\n5. You can also view visitor logs in "Visitors" page',
    },
  },
  // Profile related queries
  profile: {
    patterns: ['profile', 'update profile', 'edit profile', 'change password', 'my information'],
    responses: {
      owner: 'To update your profile:\n1. Click on "Profile" in the sidebar\n2. You can view your information\n3. To update, click "Edit Profile"\n4. Modify your details (name, phone, etc.)\n5. Click "Save Changes"',
      tenant: 'To update your profile:\n1. Click on "Profile" in the sidebar\n2. You can view your information\n3. To update, click "Edit Profile"\n4. Modify your details (name, phone, etc.)\n5. Click "Save Changes"',
      committee: 'To update your profile:\n1. Click on "Profile" in the sidebar\n2. You can view your information\n3. To update, click "Edit Profile"\n4. Modify your details\n5. Click "Save Changes"',
      admin: 'To update your profile:\n1. Click on "Profile" in the sidebar\n2. You can view your information\n3. To update, click "Edit Profile"\n4. Modify your details\n5. Click "Save Changes"\n\nTo manage users, go to "Users" page.',
      security: 'To update your profile:\n1. Click on "Profile" in the sidebar\n2. You can view your information\n3. To update, click "Edit Profile"\n4. Modify your details\n5. Click "Save Changes"',
    },
  },
  // Dashboard related queries
  dashboard: {
    patterns: ['dashboard', 'home', 'overview', 'summary', 'main page'],
    responses: {
      owner: 'The dashboard shows:\n- Maintenance bills due\n- Active polls\n- Upcoming visitors\n- Latest notices\n- Your recent complaints\n\nTo access dashboard, click "Dashboard" in the sidebar.',
      tenant: 'The dashboard shows:\n- Active polls\n- Upcoming visitors\n- Latest notices\n- Your recent complaints\n\nTo access dashboard, click "Dashboard" in the sidebar.',
      committee: 'The dashboard shows:\n- Maintenance bills due\n- Active polls\n- Upcoming visitors\n- Latest notices\n- Recent complaints\n\nTo access dashboard, click "Dashboard" in the sidebar.',
      admin: 'The dashboard shows:\n- Maintenance bills due\n- Active polls\n- Upcoming visitors\n- Latest notices\n- Recent complaints\n\nTo access dashboard, click "Dashboard" in the sidebar.',
      security: 'Security staff are redirected to Visitors page. The dashboard shows visitor information and notices.',
    },
  },
  // Users/Members related queries (for admin/committee)
  users: {
    patterns: ['users', 'members', 'user management', 'add user', 'manage members'],
    responses: {
      owner: 'User management is available only to committee and admin. You can view members in "Members" page.',
      tenant: 'User management is available only to committee and admin. You can view members in "Members" page.',
      committee: 'To manage users:\n1. Go to "Users" page from sidebar\n2. You can view all members\n3. Click on a user to view details\n4. You can approve/activate users\n5. To add new user, use registration or admin panel',
      admin: 'To manage users:\n1. Go to "Users" page from sidebar\n2. You can view all members\n3. Click on a user to view/edit details\n4. You can approve/activate users, change roles\n5. To add new user, use registration or admin panel',
      security: 'User management is available only to committee and admin.',
    },
  },
  // Community related queries
  community: {
    patterns: ['community', 'post', 'posts', 'community post', 'create post'],
    responses: {
      owner: 'To create a community post:\n1. Go to "Community" page from sidebar\n2. Click "Create Post" button\n3. Enter your post content\n4. Click "Submit"\n\nTo view community posts, go to "Community" page.',
      tenant: 'To create a community post:\n1. Go to "Community" page from sidebar\n2. Click "Create Post" button\n3. Enter your post content\n4. Click "Submit"\n\nTo view community posts, go to "Community" page.',
      committee: 'To create a community post:\n1. Go to "Community" page from sidebar\n2. Click "Create Post" button\n3. Enter your post content\n4. Click "Submit"\n\nTo view community posts, go to "Community" page.',
      admin: 'To create a community post:\n1. Go to "Community" page from sidebar\n2. Click "Create Post" button\n3. Enter your post content\n4. Click "Submit"\n\nTo view community posts, go to "Community" page.',
      security: 'To create a community post:\n1. Go to "Community" page from sidebar\n2. Click "Create Post" button\n3. Enter your post content\n4. Click "Submit"\n\nTo view community posts, go to "Community" page.',
    },
  },
  // General help
  help: {
    patterns: ['help', 'how to', 'guide', 'tutorial', 'what can i do', 'features'],
    responses: {
      owner: 'I can help you with:\n- Viewing and managing notices\n- Checking maintenance bills and payments\n- Filing and tracking complaints\n- Voting in polls\n- Scheduling visitors\n- Creating community posts\n- Updating your profile\n\nAsk me about any feature!',
      tenant: 'I can help you with:\n- Viewing notices\n- Checking maintenance bills and payments\n- Filing and tracking complaints\n- Voting in polls\n- Scheduling visitors\n- Creating community posts\n- Updating your profile\n\nAsk me about any feature!',
      committee: 'I can help you with:\n- Creating and managing notices\n- Creating maintenance bills\n- Managing complaints\n- Creating polls\n- Viewing payments\n- Scheduling visitors\n- Managing users\n- Creating community posts\n\nAsk me about any feature!',
      admin: 'I can help you with:\n- Creating and managing notices\n- Creating maintenance bills\n- Managing complaints\n- Creating polls\n- Viewing payments\n- Managing users and roles\n- Scheduling visitors\n- Creating community posts\n\nAsk me about any feature!',
      security: 'I can help you with:\n- Viewing notices\n- Checking in/out visitors\n- Viewing visitor logs\n- Filing complaints\n- Voting in polls\n- Creating community posts\n- Updating your profile\n\nAsk me about any feature!',
    },
  },
};

// Find matching topic
function findMatchingTopic(query) {
  const normalizedQuery = query.toLowerCase().trim();
  
  for (const [topic, data] of Object.entries(knowledgeBase)) {
    for (const pattern of data.patterns) {
      if (normalizedQuery.includes(pattern.toLowerCase())) {
        return topic;
      }
    }
  }
  
  return null;
}

// Get response based on role and topic
function getResponse(topic, role) {
  if (!topic || !knowledgeBase[topic]) {
    return null;
  }
  
  const topicData = knowledgeBase[topic];
  return topicData.responses[role] || topicData.responses.owner;
}

// Chatbot controller
const chatWithBot = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const user = req.user;
  
  if (!message || !message.trim()) {
    throw new ApiError(400, 'Message is required');
  }
  
  const topic = findMatchingTopic(message);
  
  let response;
  if (topic) {
    response = getResponse(topic, user.role);
  }
  
  // Default response if no match found
  if (!response) {
    response = 'I cannot answer your question';
  }
  
  res.json({
    success: true,
    data: {
      response,
    },
  });
});

module.exports = {
  chatWithBot,
};
