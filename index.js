/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */

const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// Language strings
const languageStrings = {  
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome Dey, you can say "Tell me a fact about Korea" or Help. Which would you like to try?',
            HELLO_MESSAGE: 'Hello World!',
            HELP_MESSAGE: 'How can I help you?',
            GOODBYE_MESSAGE: 'Goodbye!',
            REFLECTOR_MESSAGE: 'You just triggered %s',
            FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MESSAGE: 'Sorry, there was an error. Please try again.',
            KOREA_FACTS: [
                "Korea is known as the 'Land of the Morning Calm'.",
                "Kimchi is a traditional Korean dish made of fermented vegetables.",
                "The Korean alphabet is called Hangul, which was created in the 15th century by King Sejong the Great.",
                "South Korea is home to advanced technology, with globally recognized brands like Samsung and LG.",
                "Taekwondo, a martial art, originated in Korea.",
                "The Korean Peninsula has been divided into North and South Korea since the end of World War II.",
                "South Korea has one of the most advanced and efficient public transportation systems in the world.",
                "The 'Hanbok' is a traditional Korean attire worn on special occasions and holidays.",
                "South Korea is famous for its entertainment industry, including K-pop and cinema, with globally popular bands and movies.",
                "The cherry blossom festival in Korea is an annual event that attracts many tourists.",
                "Bibimbap is a traditional Korean dish consisting of rice mixed with vegetables, meat, and a chili pepper paste."
            ]
        }
    },  
    es: {
        translation: {
            WELCOME_MESSAGE: 'Bienvenido Dey, puedes decir "dame un dato de Corea" o Ayuda. ¿Cuál prefieres?',
            HELLO_MESSAGE: '¡Hola Mundo!',
            HELP_MESSAGE: '¿Cómo te puedo ayudar?',
            GOODBYE_MESSAGE: '¡Adiós!',
            REFLECTOR_MESSAGE: 'Acabas de activar %s',
            FALLBACK_MESSAGE: 'Lo siento, no sé nada sobre eso. Por favor inténtalo otra vez.',
            ERROR_MESSAGE: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez.',
            KOREA_FACTS: [
                "Corea es conocida como la 'Tierra de la Calma Matutina'.",
                "El kimchi es un plato tradicional coreano hecho de verduras fermentadas.",
                "El alfabeto coreano se llama Hangul, que fue creado en el siglo XV por el rey Sejong el Grande.",
                "Corea del Sur es el hogar de la tecnología avanzada, con marcas reconocidas mundialmente como Samsung y LG.",
                "El Taekwondo, un arte marcial, se originó en Corea.",
                "La península coreana ha estado dividida en Corea del Norte y Corea del Sur desde el final de la Segunda Guerra Mundial.",
                "Corea del Sur tiene uno de los sistemas de transporte público más avanzados y eficientes del mundo.",
                "El 'Hanbok' es un traje tradicional coreano usado en ocasiones especiales y festividades.",
                "Corea del Sur es famosa por su industria del entretenimiento, incluyendo el K-pop y el cine, con bandas y películas populares globalmente.",
                "El festival de los cerezos en flor en Corea es un evento anual que atrae a muchos turistas.",
                "El 'Bibimbap' es un plato tradicional coreano que consiste en arroz mezclado con vegetales, carne, y una salsa de chile."
            ]
        }
    }
};

// Handlers
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = attributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Function to get a random Korea fact
function getRandomKoreaFact(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    const koreaFacts = attributes.t('KOREA_FACTS', { returnObjects: true });

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * koreaFacts.length);
    } while (randomIndex === sessionAttributes.lastKoreaFactIndex);

    sessionAttributes.lastKoreaFactIndex = randomIndex;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    return koreaFacts[randomIndex];
}

const KoreaFactsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'KoreaFactsIntent';
    },
    handle(handlerInput) {
        const speakOutput = getRandomKoreaFact(handlerInput);
        const repromptOutput = "Would you like to hear another fact?";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = attributes.t('HELP_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = attributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = attributes.t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = attributes.t('REFLECTOR_MESSAGE', intentName);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = attributes.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};
// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};
// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        KoreaFactsIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
