
import ArrayUtil from '../ArrayUtil'
import Chain from '../Chain'
import Encoder from '../Encoder'
import MathUtil from '../MathUtil'
import StringUtil from '../StringUtil'

const meta = {
  name: 'enigma',
  title: 'Enigma machine',
  category: 'Substitution cipher',
  type: 'encoder'
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

/**
 * Describes the mechanisms, rotors and features of each Engima model.
 * @see  http://www.cryptomuseum.com/crypto/enigma/index.htm
 * @type {object[]}
 */
const models = [
  {
    name: 'I',
    label: 'Enigma I',
    description: 'German Army & Air Force',
    characterGroupSize: 5,
    plugboard: true,
    entryRotor: 'ETW-ABCDEF',
    reflectorRotors: ['UKW-A', 'UKW-B', 'UKW-C'],
    reflectorThumbwheel: false,
    slots: [
      { rotors: ['I', 'II', 'III', 'IV', 'V'] },
      { rotors: ['I', 'II', 'III', 'IV', 'V'] },
      { rotors: ['I', 'II', 'III', 'IV', 'V'] }
    ]
  },
  {
    name: 'N',
    label: 'Enigma I "Norenigma"',
    description: 'Norwegian Police Security Service',
    characterGroupSize: 5,
    plugboard: true,
    entryRotor: 'ETW-ABCDEF',
    reflectorRotors: ['UKW-N'],
    reflectorThumbwheel: false,
    slots: [
      { rotors: ['I-N', 'II-N', 'III-N', 'IV-N', 'V-N'] },
      { rotors: ['I-N', 'II-N', 'III-N', 'IV-N', 'V-N'] },
      { rotors: ['I-N', 'II-N', 'III-N', 'IV-N', 'V-N'] }
    ]
  },
  {
    name: 'S',
    label: 'Enigma I "Sondermaschine"',
    description: 'German Intelligence',
    characterGroupSize: 5,
    plugboard: true,
    entryRotor: 'ETW-ABCDEF',
    reflectorRotors: ['UKW-S'],
    reflectorThumbwheel: false,
    slots: [
      { rotors: ['I-S', 'II-S', 'III-S'] },
      { rotors: ['I-S', 'II-S', 'III-S'] },
      { rotors: ['I-S', 'II-S', 'III-S'] }
    ]
  },
  {
    name: 'M3',
    label: 'Enigma M3',
    description: 'German Army & Navy',
    characterGroupSize: 5,
    plugboard: true,
    entryRotor: 'ETW-ABCDEF',
    reflectorRotors: ['UKW-B', 'UKW-C'],
    reflectorThumbwheel: false,
    slots: [
      { rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] },
      { rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] },
      { rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] }
    ]
  },
  {
    name: 'M4',
    label: 'Enigma M4 "Shark"',
    description: 'German Submarines',
    characterGroupSize: 4,
    plugboard: true,
    entryRotor: 'ETW-ABCDEF',
    reflectorRotors: ['UKW-B-thin', 'UKW-C-thin'],
    reflectorThumbwheel: false,
    slots: [
      { rotors: ['beta', 'gamma'], rotating: false },
      { rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] },
      { rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] },
      { rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] }
    ]
  },
  {
    name: 'D',
    label: 'Enigma D / K',
    description: 'Commercial Enigma',
    characterGroupSize: 5,
    plugboard: false,
    entryRotor: 'ETW-QWERTZ',
    reflectorRotors: ['UKW-COM'],
    reflectorThumbwheel: true,
    slots: [
      { rotors: ['I-D', 'II-D', 'III-D'] },
      { rotors: ['I-D', 'II-D', 'III-D'] },
      { rotors: ['I-D', 'II-D', 'III-D'] }
    ]
  },
  {
    name: 'T',
    label: 'Enigma T "Tirpitz"',
    description: 'Japanese Army',
    characterGroupSize: 5,
    plugboard: false,
    entryRotor: 'ETW-T',
    reflectorRotors: ['UKW-T'],
    reflectorThumbwheel: true,
    slots: [
      { rotors: [
        'I-T', 'II-T', 'III-T', 'IV-T',
        'V-T', 'VI-T', 'VII-T', 'VIII-T'] },
      { rotors: [
        'I-T', 'II-T', 'III-T', 'IV-T',
        'V-T', 'VI-T', 'VII-T', 'VIII-T'] },
      { rotors: [
        'I-T', 'II-T', 'III-T', 'IV-T',
        'V-T', 'VI-T', 'VII-T', 'VIII-T'] }
    ]
  },
  {
    name: 'KS',
    label: 'Swiss-K',
    description: 'Swiss Army & Air Force',
    characterGroupSize: 5,
    plugboard: false,
    entryRotor: 'ETW-QWERTZ',
    reflectorRotors: ['UKW-COM'],
    reflectorThumbwheel: true,
    slots: [
      { rotors: ['I-KS', 'II-KS', 'III-KS'] },
      { rotors: ['I-KS', 'II-KS', 'III-KS'] },
      { rotors: ['I-KS', 'II-KS', 'III-KS'] }
    ]
  },
  {
    name: 'KR',
    label: 'Railway Enigma "Rocket I"',
    description: 'German Railway',
    characterGroupSize: 5,
    plugboard: false,
    entryRotor: 'ETW-QWERTZ',
    reflectorRotors: ['UKW-KR'],
    reflectorThumbwheel: true,
    slots: [
      { rotors: ['I-KR', 'II-KR', 'III-KR'] },
      { rotors: ['I-KR', 'II-KR', 'III-KR'] },
      { rotors: ['I-KR', 'II-KR', 'III-KR'] }
    ]
  },
  {
    name: 'Z',
    label: 'Zählwerk Enigma A-865',
    description: null,
    characterGroupSize: 5,
    plugboard: false,
    entryRotor: 'ETW-QWERTZ',
    reflectorRotors: ['UKW-COM'],
    reflectorThumbwheel: true,
    reflectorRotating: true,
    turnoverMechanism: 'cog',
    slots: [
      { rotors: ['I-Z', 'II-Z', 'III-Z'] },
      { rotors: ['I-Z', 'II-Z', 'III-Z'] },
      { rotors: ['I-Z', 'II-Z', 'III-Z'] }
    ]
  },
  {
    name: 'G111',
    label: 'Abwehr Enigma G-111',
    description: null,
    characterGroupSize: 5,
    plugboard: false,
    entryRotor: 'ETW-QWERTZ',
    reflectorRotors: ['UKW-COM'],
    reflectorThumbwheel: true,
    reflectorRotating: true,
    turnoverMechanism: 'cog',
    slots: [
      { rotors: ['I-G111', 'II-G111', 'V-G111'] },
      { rotors: ['I-G111', 'II-G111', 'V-G111'] },
      { rotors: ['I-G111', 'II-G111', 'V-G111'] }
    ]
  },
  {
    name: 'G312',
    label: 'Abwehr Enigma G-312',
    description: 'German Seret Service',
    characterGroupSize: 5,
    plugboard: false,
    entryRotor: 'ETW-QWERTZ',
    reflectorRotors: ['UKW-G312'],
    reflectorThumbwheel: true,
    reflectorRotating: true,
    turnoverMechanism: 'cog',
    slots: [
      { rotors: ['I-G312', 'II-G312', 'III-G312'] },
      { rotors: ['I-G312', 'II-G312', 'III-G312'] },
      { rotors: ['I-G312', 'II-G312', 'III-G312'] }
    ]
  },
  {
    name: 'G260',
    label: 'Abwehr Enigma G-260',
    description: 'German Seret Service in Argentina',
    characterGroupSize: 5,
    plugboard: false,
    entryRotor: 'ETW-QWERTZ',
    reflectorRotors: ['UKW-COM'],
    reflectorThumbwheel: true,
    reflectorRotating: true,
    turnoverMechanism: 'cog',
    slots: [
      { rotors: ['I-G260', 'II-G260', 'III-G260'] },
      { rotors: ['I-G260', 'II-G260', 'III-G260'] },
      { rotors: ['I-G260', 'II-G260', 'III-G260'] }
    ]
  }
]

/**
 * Columns to be used on the `rotorTable` array.
 * @type {string[]}
 */
const rotorTableColumns = ['name', 'label', 'wiring', 'turnovers']

/**
 * Table of rotor specs. The `rotorTableColumns` array defines how many columns
 * each row contains in which order. This table is converted to objects lazily.
 * The `name` column identifies each rotor and connects it to models.
 * The `wiring` column describes how characters are mapped relative to the
 * default alphabet.
 * @see  http://www.cryptomuseum.com/crypto/enigma/wiring.htm
 * @type {string[]}
 */
const rotorTable = [
  /* eslint-disable no-multi-spaces */

  // Entry rotor wired in alphabetical order
  'ETW-ABCDEF', 'Alphabet',   'abcdefghijklmnopqrstuvwxyz', '',

  // Entry rotor wired in order of keyboard
  'ETW-QWERTZ', 'Keyboard',   'jwulcmnohpqzyxiradkegvbtsf', '',

  // Enigma I, M3, M4
  'I',          'I',          'ekmflgdqvzntowyhxuspaibrcj', 'q',
  'II',         'II',         'ajdksiruxblhwtmcqgznpyfvoe', 'e',
  'III',        'III',        'bdfhjlcprtxvznyeiwgakmusqo', 'v',
  'IV',         'IV',         'esovpzjayquirhxlnftgkdcmwb', 'j',
  'V',          'V',          'vzbrgityupsdnhlxawmjqofeck', 'z',
  'VI',         'VI',         'jpgvoumfyqbenhzrdkasxlictw', 'zm',
  'VII',        'VII',        'nzjhgrcxmyswboufaivlpekqdt', 'zm',
  'VIII',       'VIII',       'fkqhtlxocbjspdzramewniuygv', 'zm',
  'beta',       'Beta',       'leyjvcnixwpbqmdrtakzgfuhos', '',
  'gamma',      'Gamma',      'fsokanuerhmbtiycwlqpzxvgjd', '',
  'UKW-A',      'UKW A',      'ejmzalyxvbwfcrquontspikhgd', '',
  'UKW-B',      'UKW B',      'yruhqsldpxngokmiebfzcwvjat', '',
  'UKW-C',      'UKW C',      'fvpjiaoyedrzxwgctkuqsbnmhl', '',
  'UKW-B-thin', 'UKW B thin', 'enkqauywjicopblmdxzvfthrgs', '',
  'UKW-C-thin', 'UKW C thin', 'rdobjntkvehmlfcwzaxgyipsuq', '',

  // Enigma I "Norenigma"
  'I-N',        'I',          'wtokasuyvrbxjhqcpzefmdinlg', 'q',
  'II-N',       'II',         'gjlpubswemctqvhxaofzdrkyni', 'e',
  'III-N',      'III',        'jwfmhnbpusdytixvzgrqlaoekc', 'v',
  'IV-N',       'IV',         'esovpzjayquirhxlnftgkdcmwb', 'j',
  'V-N',        'V',          'hejxqotzbvfdascilwpgynmurk', 'z',
  'UKW-N',      'UKW',        'mowjypuxndsraibfvlkzgqchet', '',

  // Enigma I "Sondermaschine"
  'I-S',        'I',          'veosirzujdqckgwypnxaflthmb', 'q',
  'II-S',       'II',         'uemoatqlshpkcyfwjzbgvxindr', 'e',
  'III-S',      'III',        'tzhxmmbsipnurjfdeqvcwglaoy', 'v',
  'UKW-S',      'UKW',        'ciagsndrbytpzfulvhekoqxwjm', '',

  // Enigma D
  'I-D',        'I',          'lpgszmhaeoqkvxrfybutnicjdw', 'y',
  'II-D',       'II',         'slvgbtfxjqohewirzyamkpcndu', 'e',
  'III-D',      'III',        'cjgdpshkturawzxfmynqobvlie', 'n',
  'UKW-COM',    'UKW',        'imetcgfraysqbzxwlhkdvupojn', '',

  // Enigma T "Tirpitz"
  'ETW-T',      'ETW',        'ilxrztkgjyamwvdufcpqeonshb', '',
  'I-T',        'I',          'kptyuelocvgrfqdanjmbswhzxi', 'wzekq',
  'II-T',       'II',         'uphzlweqmtdjxcaksoigvbyfnr', 'wzflr',
  'III-T',      'III',        'qudlyrfekonvzaxwhmgpjbsict', 'wzekq',
  'IV-T',       'IV',         'ciwtbkxnrespflydagvhquojzm', 'wzflr',
  'V-T',        'V',          'uaxgisnjbverdylfzwtpckohmq', 'ycfkr',
  'VI-T',       'VI',         'xfuzgalvhcnysewqtdmrbkpioj', 'xeimq',
  'VII-T',      'VII',        'bjvftxplnayozikwgdqeruchsm', 'ycfkr',
  'VIII-T',     'VIII',       'ymtpnzhwkodajxeluqvgcbisfr', 'xeimq',
  'UKW-T',      'UKW',        'gekpbtaumocniljdxzyfhwvqsr', '',

  // Swiss-K
  'I-KS',       'I',          'pezuohxscvfmtbglrinqjwaydk', 'y',
  'II-KS',      'II',         'zouesydkfwpciqxhmvblgnjrat', 'e',
  'III-KS',     'III',        'ehrvxgaobqusimzflynwktpdjc', 'n',

  // Railway Enigma "Rocket I"
  'I-KR',       'I',          'jgdqoxuscamifrvtpnewkblzyh', 'n',
  'II-KR',      'II',         'ntzpsfbokmwrcjdivlaeyuxhgq', 'e',
  'III-KR',     'III',        'jviubhtcdyakeqzposgxnrmwfl', 'y',
  'UKW-KR',     'UKW',        'qyhognecvpuztfdjaxwmkisrbl', '',

  // Enigma Zählwerk A-865
  'I-Z',        'I',          'lpgszmhaeoqkvxrfybutnicjdw', 'suvwzabcefgiklopq',
  'II-Z',       'II',         'slvgbtfxjqohewirzyamkpcndu', 'stvyzacdfghkmnq',
  'III-Z',      'III',        'cjgdpshkturawzxfmynqobvlie', 'uwxaefhkmnr',

  // Enigma Zählwerk G-111
  'I-G111',     'I',          'wlrhbqundkjczsexotmagyfpvi', 'suvwzabcefgiklopq',
  'II-G111',    'II',         'tfjqazwmhlcuixrdygoevbnskp', 'stvyzacdfghkmnq',
  'V-G111',     'V',          'qtpixwvdfrmusljohcanezkybg', 'swzfhmq',

  // Abwehr Enigma G-312
  'I-G312',     'I',          'dmtwsilruyqnkfejcazbpgxohv', 'suvwzabcefgiklopq',
  'II-G312',    'II',         'hqzgpjtmoblncifdyawveusrkx', 'stvyzacdfghkmnq',
  'III-G312',   'III',        'uqntlszfmrehdpxkibvygjcwoa', 'uwxaefhkmnr',
  'UKW-G312',   'UKW',        'rulqmzjsygocetkwdahnbxpvif', '',

  // Abwehr Enigma G-260
  'I-G260',     'I',          'rcspblkqaumhwytifzvgojnexd', 'suvwzabcefgiklopq',
  'II-G260',    'II',         'wcmibvpjxarosgndlzkeyhufqt', 'stvyzacdfghkmnq',
  'III-G260',   'III',        'fvdhzelsqmaxokyiwpgcbujtnr', 'uwxaefhkmnr'

  /* eslint-enable no-multi-spaces */
]

/**
 * Object mapping model names to model objects.
 * Created lazily by {@link EnigmaEncoder.getModel}.
 * @type {object}
 */
let modelMap = null

/**
 * Object mapping rotor names to rotor objects.
 * Created lazily by {@link EnigmaEncoder.getRotor}.
 * @type {object}
 */
let rotorMap = null

/**
 * Encoder brick for Enigma machine encoding and decoding
 */
export default class EnigmaEncoder extends Encoder {
  /**
   * Returns brick meta.
   * @return {object}
   */
  static getMeta () {
    return meta
  }

  /**
   * Constructor
   */
  constructor () {
    super()

    // retrieve default model with its rotors
    const model = EnigmaEncoder.getModel('M3')
    const rotors = EnigmaEncoder.getRotors(model.slots[0].rotors)
    const rotorNames = rotors.map(rotor => rotor.name)
    const rotorLabels = rotors.map(rotor => rotor.label)
    const reflectorRotors = EnigmaEncoder.getRotors(model.reflectorRotors)

    this.registerSetting({
      name: 'model',
      type: 'enum',
      value: model.name,
      randomizable: false,
      options: {
        elements: models.map(model => model.name),
        labels: models.map(model => model.label),
        descriptions: models.map(model => model.description)
      }
    })

    this.registerSetting({
      name: 'reflector',
      type: 'enum',
      value: reflectorRotors[0].name,
      width: 4,
      options: {
        elements: reflectorRotors.map(rotor => rotor.name),
        labels: reflectorRotors.map(rotor => rotor.label)
      }
    })

    this.registerSetting({
      name: `positionReflector`,
      label: `Position`,
      type: 'number',
      value: 1,
      randomizable: false,
      width: 4,
      options: {
        integer: true,
        min: 1,
        max: 27
      }
    })

    this.registerSetting({
      name: `ringReflector`,
      label: `Ring`,
      type: 'number',
      value: 1,
      width: 4,
      options: {
        integer: true,
        min: 1,
        max: 27
      }
    })

    // register settings for each possible slot
    for (let i = 0; i < EnigmaEncoder.getMaxSlotCount(); i++) {
      this.registerSetting({
        name: `rotor${i + 1}`,
        label: `Rotor ${i + 1}`,
        type: 'enum',
        value: rotorNames[0],
        randomizable: false,
        width: 4,
        options: {
          elements: rotorNames,
          labels: rotorLabels
        }
      })

      this.registerSetting({
        name: `position${i + 1}`,
        label: `Position`,
        type: 'number',
        value: 1,
        width: 4,
        options: {
          integer: true,
          min: 1,
          max: 27
        }
      })

      this.registerSetting({
        name: `ring${i + 1}`,
        label: `Ring`,
        type: 'number',
        value: 1,
        width: 4,
        options: {
          integer: true,
          min: 1,
          max: 27
        }
      })
    }

    this.registerSetting({
      name: 'plugboard',
      type: 'text',
      value: '',
      validateValue: this.validatePlugboardValue.bind(this),
      filterValue: value => Chain.wrap(value.getString().trim().toLowerCase()),
      randomizeValue: this.randomizePlugboardValue.bind(this)
    })

    this.registerSetting({
      name: 'includeForeignChars',
      type: 'boolean',
      label: 'Foreign Chars',
      value: false,
      randomizable: false,
      options: {
        trueLabel: 'Include',
        falseLabel: 'Ignore'
      }
    })

    // apply options and layout for given model
    this.applyModel(model.name)
  }

  /**
   * Triggered when a setting value has changed.
   * @protected
   * @param {Setting} setting
   * @param {mixed} value Setting value
   */
  settingValueDidChange (setting, value) {
    super.settingValueDidChange(setting, value)
    if (setting.getName() === 'model') {
      this.applyModel(value)
    }
  }

  /**
   * Updates the settings interface to reflect the given model.
   * @protected
   * @param {string} modelName Model name
   * @return {EnigmaEncoder} Fluent interface
   */
  applyModel (modelName) {
    const model = EnigmaEncoder.getModel(modelName)
    const maxSlotCount = EnigmaEncoder.getMaxSlotCount()

    // update setting options and layout for each slot
    for (let i = 0; i < maxSlotCount; i++) {
      const slot = i < model.slots.length ? model.slots[i] : null
      const slotVisible = slot !== null

      const rotorSetting = this.getSetting(`rotor${i + 1}`)
      const ringSetting = this.getSetting(`ring${i + 1}`)
      const positionSetting = this.getSetting(`position${i + 1}`)

      // hide or show slot settings depending on model
      rotorSetting.setVisible(slotVisible)
      ringSetting.setVisible(slotVisible)
      positionSetting.setVisible(slotVisible)

      if (slotVisible) {
        // configure rotor setting
        const rotors = EnigmaEncoder.getRotors(slot.rotors)
        rotorSetting.setElements(
          rotors.map(rotor => rotor.name),
          rotors.map(rotor => rotor.label),
          null,
          false)

        // apply slot default if current value is not available for this model
        if (rotorSetting.validateValue(rotorSetting.getValue()) !== true) {
          rotorSetting.setValue(rotors[0].name)
        }
      }
    }

    // update reflector setting options
    const reflectorRotors = EnigmaEncoder.getRotors(model.reflectorRotors)
    const reflectorSetting = this.getSetting('reflector')

    reflectorSetting.setElements(
      reflectorRotors.map(rotor => rotor.name),
      reflectorRotors.map(rotor => rotor.label),
      null,
      false)

    // apply first rotor if current one is not available for this model
    if (reflectorSetting.validateValue(reflectorSetting.getValue()) !== true) {
      reflectorSetting.setValue(reflectorRotors[0].name)
    }

    // make reflector position and ring visible when it has a thumbwheel
    reflectorSetting.setWidth(model.reflectorThumbwheel ? 4 : 12)
    reflectorSetting.setVisible(
      model.reflectorThumbwheel || reflectorRotors.length > 1)

    this.getSetting('positionReflector').setVisible(model.reflectorThumbwheel)
    this.getSetting('ringReflector').setVisible(model.reflectorThumbwheel)

    // only make plugboard visible when it is availabe for this model
    this.getSetting('plugboard').setVisible(model.plugboard)
  }

  /**
   * Performs encode or decode on given content.
   * @protected
   * @param {Chain} content
   * @param {boolean} isEncode True for encoding, false for decoding
   * @return {Chain}
   */
  performTranslate (content, isEncode) {
    const includeForeignChars = this.getSettingValue('includeForeignChars')
    const model = EnigmaEncoder.getModel(this.getSettingValue('model'))
    let i = 0

    // collect slots, rotors, positions and rings for current translation
    const slots = model.slots
    const rotors = []
    const positions = []
    const rings = []

    for (i = 0; i < slots.length; i++) {
      const name = this.getSettingValue(`rotor${i + 1}`)
      rotors.push(EnigmaEncoder.getRotor(name))
      positions.push(this.getSettingValue(`position${i + 1}`) - 1)
      rings.push(this.getSettingValue(`ring${i + 1}`) - 1)
    }

    // retrieve entry config
    const entryRotor = EnigmaEncoder.getRotor(model.entryRotor)
    const entryPosition = 0
    const entryRing = 0

    // retrieve reflector config
    const reflectorRotor =
      EnigmaEncoder.getRotor(this.getSettingValue('reflector'))
    let reflectorPosition = model.reflectorThumbwheel
      ? this.getSettingValue('positionReflector')
      : 0
    const reflectorRing = model.reflectorThumbwheel
      ? this.getSettingValue('ringReflector')
      : 0

    // compose plugboard wiring, if it is available for this model
    let plugboard = null
    if (model.plugboard) {
      const plugboardSetting = this.getSettingValue('plugboard')
      plugboard = this.wiringFromPlugboardValue(plugboardSetting.toString())
    }

    // use a short 'map' alias to call the static rotorMapChar method
    const map = EnigmaEncoder.rotorMapChar

    // go through each content code point
    let encodedCodePoints = content.getCodePoints().map((codePoint, index) => {
      let char = null

      if (codePoint >= 65 && codePoint <= 90) {
        // read uppercase character
        char = codePoint - 65
      } else if (codePoint >= 97 && codePoint <= 122) {
        // read lowercase character
        char = codePoint - 97
      } else {
        // this is a foreign character
        return includeForeignChars ? codePoint : false
      }

      if (model.turnoverMechanism === 'cog') {
        // engage cog-wheel driven wheel-turnover mechanism
        let turnover = true
        i = slots.length - 1

        while (turnover && i >= 0) {
          if (slots[i].rotating !== false) {
            turnover = EnigmaEncoder.rotorAtTurnover(rotors[i], positions[i])
            positions[i]++
          } else {
            turnover = false
          }
          i--
        }

        // step reflector if it is rotating
        if (turnover && model.reflectorRotating === true) {
          reflectorPosition++
        }
      } else {
        // engage lever driven wheel-turnover mechanism
        let stepped = false
        i = 1

        while (!stepped && i < slots.length) {
          stepped = EnigmaEncoder.rotorAtTurnover(rotors[i], positions[i])
          if (stepped) {
            // shift current rotor, if it is not the last one (rotated later)
            if (i !== slots.length - 1) {
              positions[i]++
            }
            // shift rotor on its left
            if (slots[i - 1].rotating !== false) {
              positions[i - 1]++
            }
          }
          i++
        }

        // shift fast rotor at every turn
        positions[positions.length - 1]++
      }

      // wire characters through the plugboard, if any
      if (plugboard !== null) {
        char = map(char, plugboard, 0, 0, false)
      }

      // through the entry
      char = map(char, entryRotor, entryPosition, entryRing, false)

      // through the rotors (from right to left)
      for (i = rotors.length - 1; i >= 0; i--) {
        char = map(char, rotors[i], positions[i], rings[i], false)
      }

      // through the reflector
      char = map(char, reflectorRotor, reflectorPosition, reflectorRing, false)

      // through the inverted rotors (from left to right)
      for (i = 0; i < rotors.length; i++) {
        char = map(char, rotors[i], positions[i], rings[i], true)
      }

      // through the inverted entry
      char = map(char, entryRotor, entryPosition, entryRing, true)

      // through the inverted plugboard, if any
      if (plugboard !== null) {
        char = map(char, plugboard, 0, 0, true)
      }

      // translate char index back to code point and return it
      return char + 97
    })

    if (!includeForeignChars) {
      const codePoints = []
      encodedCodePoints.forEach(codePoint => {
        // filter foreign characters
        if (codePoint === false) {
          return
        }
        // append a space after each character group
        if ((codePoints.length + 1) % (model.characterGroupSize + 1) === 0) {
          codePoints.push(32)
        }
        // append code point
        codePoints.push(codePoint)
      })
      encodedCodePoints = codePoints
    }

    return Chain.wrap(encodedCodePoints)
  }

  /**
   * Checks if given rotor has a turnover at given position.
   * @protected
   * @param {object} rotor Rotor entry
   * @param {number} position Rotor position
   * @return {boolean} True, if rotor has a turnover at given position
   */
  static rotorAtTurnover (rotor, position) {
    if (rotor.turnovers === undefined) {
      return false
    }
    const positionChar = String.fromCharCode(97 + MathUtil.mod(position, 26))
    return rotor.turnovers.indexOf(positionChar) !== -1
  }

  /**
   * Wires character index (0-25) through given rotor at given position.
   * @protected
   * @param {number} charIndex Character index (0-25)
   * @param {object|string} rotorOrWiring Rotor entry or wiring string
   * @param {number} position Rotor position
   * @param {number} ringSetting Rotor ring setting
   * @param {boolean} inverted Wether to wire backwards
   * @return {number} Mapped character index (0-25)
   */
  static rotorMapChar (
    charIndex, rotorOrWiring, position, ringSetting, inverted
  ) {
    const wiring = typeof rotorOrWiring === 'string'
      ? rotorOrWiring
      : rotorOrWiring.wiring

    // apply ring setting
    position = MathUtil.mod(position - ringSetting, 26)

    // map character
    charIndex = MathUtil.mod(charIndex + position, 26)
    charIndex = !inverted
      ? wiring.charCodeAt(charIndex) - 97
      : wiring.indexOf(String.fromCharCode(97 + charIndex))
    charIndex = MathUtil.mod(charIndex - position, 26)
    return charIndex
  }

  /**
   * Validates plugboard setting value.
   * @protected
   * @param {mixed} rawValue
   * @param {Setting} setting
   * @return {boolean} Returns true, if value is valid.
   */
  validatePlugboardValue (rawValue, setting) {
    // filter raw value
    const plugboard = setting.filterValue(rawValue).getString()

    // empty plugboard is valid
    if (plugboard === '') {
      return true
    }

    // check format (ab cd ef)
    if (plugboard.match(/^([a-z]{2}\s)*([a-z]{2})$/) === null) {
      return {
        key: 'enigmaPlugboardInvalidFormat',
        message:
          `Invalid plugboard format: pairs of letters to be swapped ` +
          `expected (e.g. 'ab cd ef')`
      }
    }

    // check if character pairs are unique
    if (!ArrayUtil.isUnique(plugboard.replace(/\s/g, '').split(''))) {
      return {
        key: 'enigmaPlugboardPairsNotUnique',
        message: `Pairs of letters to be swapped need to be unique`
      }
    }

    return true
  }

  /**
   * Converts plugboard value to rotor wiring string.
   * @protected
   * @param {string} plugboard String with pairs of letters to be swapped
   * @return {string} Rotor wiring
   */
  wiringFromPlugboardValue (plugboard) {
    const wiring = alphabet.split('')
    plugboard.split(' ').forEach(pair => {
      wiring[pair.charCodeAt(0) - 97] = pair[1]
      wiring[pair.charCodeAt(1) - 97] = pair[0]
    })
    return wiring.join('')
  }

  /**
   * Returns wether this brick is randomizable.
   * @return {boolean}
   */
  isRandomizable () {
    return true
  }

  /**
   * Applies randomly chosen values to the brick.
   * @return {Brick} Fluent interface
   */
  randomize () {
    const model = EnigmaEncoder.getModel(this.getSettingValue('model'))
    let i, index, rotor

    // gather rotor collection available to current model
    let rotors = model.reflectorRotors
    for (i = 0; i < model.slots.length; i++) {
      rotors = rotors.concat(model.slots[i].rotors)
    }

    // usually one set of rotors only contain a single rotor for each type
    rotors = ArrayUtil.unique(rotors)

    // randomize rotor collection
    rotors = ArrayUtil.shuffle(rotors)

    // pick a reflector
    index = rotors.findIndex(rotor =>
      model.reflectorRotors.indexOf(rotor) !== -1)
    if (index !== -1) {
      rotor = rotors.splice(index, 1)[0]
      this.setSettingValue('reflector', rotor)
    }

    // pick a rotor for each slot
    for (i = 0; i < model.slots.length; i++) {
      index = rotors.findIndex(rotor =>
        model.slots[i].rotors.indexOf(rotor) !== -1)
      if (index !== -1) {
        rotor = rotors.splice(index, 1)[0]
        this.setSettingValue(`rotor${i + 1}`, rotor)
      }
    }

    // randomize remainding settings
    super.randomize()
    return this
  }

  /**
   * Generates a random plugboard setting value.
   * @protected
   * @param {Random} random Random instance
   * @param {Setting} setting Plugboard setting
   * @return {string} Randomized plugboard setting value
   */
  randomizePlugboardValue (random, setting) {
    const shuffled =
      ArrayUtil.shuffle(alphabet.split(''), random)
        .join('').substr(0, 20)
    return StringUtil.chunk(shuffled, 2).join(' ')
  }

  /**
   * Returns a model entry by given name.
   * @protected
   * @param {string} name Model name
   * @return {?object} Returns model entry or null if not found.
   */
  static getModel (name) {
    if (modelMap === null) {
      // build model map lazily
      modelMap = {}
      models.forEach(model => {
        modelMap[model.name] = model
      })
    }
    return modelMap[name] || null
  }

  /**
   * Returns the max slot count for all available models.
   * @protected
   * @return {number} Max slot count
   */
  static getMaxSlotCount () {
    return models.reduce((max, model) => Math.max(max, model.slots.length), 0)
  }

  /**
   * Returns a rotor entry by given name.
   * @protected
   * @param {string} name Rotor name
   * @return {?object} Rotor entry or null if not found.
   */
  static getRotor (name) {
    if (rotorMap === null) {
      // read rotor table and build map lazily
      rotorMap = {}
      let i, j, rotor
      for (i = 0; i < rotorTable.length; i += rotorTableColumns.length) {
        rotor = {}
        for (j = 0; j < rotorTableColumns.length; j++) {
          rotor[rotorTableColumns[j]] = rotorTable[i + j]
        }
        rotorMap[rotor.name] = rotor
      }
    }
    return rotorMap[name] || null
  }

  /**
   * Maps given names to rotor entries.
   * @protected
   * @param {string[]} names Rotor names
   * @return {object[]} Rotor entries
   */
  static getRotors (names) {
    return names.map(name => EnigmaEncoder.getRotor(name))
  }
}
