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
  
  export const userUpdateSchema = {
    body: {
      type: 'object',
      required: ['user_id', 'username'],
      properties: {
        user_id: { type: 'string' },
        username: { type: 'string' }
      }
    }
  };
  
  export const conversationsStartSchema = {
    body: {
      type: 'object',
      required: ['receipentId'],
      properties: {
        receipentId: { type: 'string' }
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
        user_id: { type: 'string' }
      }
    }
  };
  
  export const blockSchema = {
    body: {
      type: 'object',
      required: ['user_id'],
      properties: {
        user_id: { type: 'string' }
      }
    }
  };
  
  export const invitationsSchema = {
    body: {
      type: 'object',
      required: ['user_id', 'invitation_type'],
      properties: {
        user_id: { type: 'string' },
        invitation_type: { type: 'string' }
      }
    }
  };