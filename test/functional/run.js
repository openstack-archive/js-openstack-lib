import Jasmine from 'jasmine'

const jasmine = new Jasmine()
jasmine.loadConfigFile('test/functional/jasmine.json')
jasmine.execute()
