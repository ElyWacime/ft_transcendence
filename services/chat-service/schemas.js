export const usersAddSchema = {
  body: {
    type: 'object',
    required: ['id', 'username'],
    properties: {
      id: { type: 'string' },
      username: { type: 'string' }
    }
  }
};

const userSchema = {
  body: {
    type: 'object',
    required: ['username'],
    properties: {
      username: { type: 'string' }
    }
  }
};

export const userUpdateSchema = {
  body: {
    type: 'object',
    required: ['user_id', 'username'],
    properties: {
      user_id: { type: 'integer' },
      username: { type: 'string' }
    }
  }
};

export const conversationsStartSchema = {
  body: {
    type: 'object',
    required: ['receipentId'],
    properties: {
      receipentId: { type: 'integer' }
    }
  }
};

export const conversationMessagesSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', pattern: '^[0-9]+$' }
    }
  }
};

export const friendsSchema = {
  body: {
    type: 'object',
    required: ['user_id'],
    properties: {
      user_id: { type: 'integer' }
    }
  }
};

export const blockSchema = {
  body: {
    type: 'object',
    required: ['user_id'],
    properties: {
      user_id: { type: 'integer' }
    }
  }
};

export const invitationsSchema = {
  body: {
    type: 'object',
    required: ['user_id', 'invitationType'],
    properties: {
      user_id: { type: 'integer' },
      invitationType: { type: 'string' }
    }
  }
};