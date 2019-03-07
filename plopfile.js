const isEmpty = require('lodash/isEmpty');

// Not empty validation
const isNotEmptyFor = name => (value) => {
  if (isEmpty(value)) return `${name} is required`;
  return true;
};

const getItemNameMessage = () => previousPromptResponse => `how should we name this ${previousPromptResponse.generatorType} ?`;

module.exports = (plop) => {
  plop.setGenerator('global', {
    description: 'app global generator',
    prompts: [{
      type: 'list',
      name: 'generatorType',
      message: 'what do you need to generate ?',
      choices: [{
        name: 'controller',
        value: 'controller'
      },
      {
        name: 'model',
        value: 'model'
      },
      {
        name: 'route',
        value: 'route'
      },
      {
        name: 'test',
        value: 'test'
      },
      {
        name: 'feature (model + controller + route + test)',
        value: 'feature'
      }
      ]
    },
    {
      type: 'input',
      name: 'generatedItemName',
      message: getItemNameMessage(),
      validate: isNotEmptyFor('name')
    }
    ],
    actions: (data) => {
      // default actions to return anyway
      let actions = [];


      // choose actions to take depending on user's choice
      switch (data.generatorType) {
        case 'controller':
          actions = actions.concat([{
            type: 'add',
            path: 'server/controllers/{{kebabCase generatedItemName}}.controller.js'
          }]);
          break;
        case 'model':
          actions = actions.concat([{
            type: 'add',
            path: 'server/models/{{kebabCase generatedItemName}}.model.js'
          }]);
          break;

        case 'route':
          actions = actions.concat([{
            type: 'add',
            path: 'server/routes/{{kebabCase generatedItemName}}.route.js'
          }]);
          break;

        case 'test':
          actions = actions.concat([{
            type: 'add',
            path: 'server/tests/{{kebabCase generatedItemName}}.test.js'
          }]);
          break;

        case 'feature':
          actions = actions.concat([{
            type: 'add',
            path: 'server/controllers/{{kebabCase generatedItemName}}.controller.js'
          },
          {
            type: 'add',
            path: 'server/models/{{kebabCase generatedItemName}}.model.js'
          },
          {
            type: 'add',
            path: 'server/routes/{{kebabCase generatedItemName}}.route.js'
          },
          {
            type: 'add',
            path: 'server/tests/{{kebabCase generatedItemName}}.test.js'
          }
          ]);
          break;

        default:
          break;
      }

      // Return the array of actions to take.
      return actions;
    }
  });
};
