const expect = require('chai').expect
const Schema = require('../schema.json')
const {get_random_obj_based_on_schema} = require('../index')
let res = get_random_obj_based_on_schema(Schema)

const get_type = type =>{
	switch (type) {
		case 'integer':
			return 'number'
		default:
			return type
	}
}

describe('get_random_obj_based_on_schema', () =>{ 
	it('Object that has required props', () => {
		expect(res).to.be.an('object').that.have.any.keys(Schema.required)
	})
	it('Has corect id type', () => {
		expect(res.id).to.satisfy(value => Schema.properties.id.anyOf.filter(type => typeof value == get_type(type) ))
	})
	it('Has corect title type', () => {
		expect(res.title).to.be.a(get_type(Schema.properties.title.type))
	})
	it('Has corect description type', () => {
		expect(res.description).to.be.a(get_type(Schema.properties.description.type))
	})
	it('Has corect startDate type', () => {
		expect(res.startDate).to.be.a(get_type(Schema.properties.startDate.type))
	})
	it('Has corect endDate type', () => {
		expect(res.endDate).to.be.a(get_type(Schema.properties.endDate.type))
		
	})
	it('Has corect parentId type', () => {
		res.parentId && expect(res.parentId).to.satisfy(value => Schema.properties.parentId.anyOf.filter(conf => {
			if(conf.type == 'null' && value == null) return true 
			return typeof value == get_type(conf.type)
		} ))
		
	})
	it('Has corect locationId type', () => {
		res.locationId && expect(res.locationId).to.satisfy(value => Schema.properties.locationId.anyOf.filter(conf => {
			if(conf.type == 'null' && value == null) return true 
			return typeof value == get_type(conf.type)
		} ))
	})
	it('Has corect process type', () => {
		res.process && expect(res.process).to.satisfy(value => Schema.properties.process.anyOf.filter(conf => {
			if(conf.type == 'null' && value == null) return true 
			return typeof value == get_type(conf.type)
		} ))
	})
	it('Has corect priorProbability type', () => {
		res.priorProbability && expect(res.priorProbability).to.satisfy(value => Schema.properties.priorProbability.anyOf.filter(conf => {
			if(conf.type == 'null' && value == null) return true 
			return typeof value == get_type(conf.type)
		} ))
	})
	it('Has corect channelId type', () => {
		res.channelId && expect(res.channelId).to.satisfy(value => Schema.properties.channelId.anyOf.filter(conf => {
			if(conf.type == 'null' && value == null) return true 
			return typeof value == get_type(conf.type)
		} ))
	})
	it('Has corect externalId type', () => {
		res.externalId && expect(res.externalId).to.satisfy(value => Schema.properties.externalId.anyOf.filter(conf => {
			if(conf.type == 'null' && value == null) return true 
			return typeof value == get_type(conf.type)
		} ))
	})
	it('Has corect tags type', () => {
		res.tags && expect(res.tags).to.be.an(Schema.properties.tags.type)
	})
	it('Has corect readOnly type', () => {
		res.readOnly && expect(res.readOnly).to.be.a(get_type(Schema.properties.readOnly.type))
	})
	it('Has corect form type', () => {
		if(res.form){
			expect(res.form).to.be.an(get_type(Schema.properties.form.type)).that.have.any.keys(Schema.properties.form.required)
			expect(res.form.id).to.be.a(get_type(Schema.properties.form.properties.id.type))
			res.form.viewModel && expect(res.form.viewModel).to.be.a(get_type(Schema.properties.form.properties.viewModel.type))
		}
	})
	it('Has corect formValue type', () => {
		res.formValue  && expect(res.formValue).to.be.an(get_type(Schema.properties.formValue.type))
	})
	it('Has corect attendees type', () => {
		expect(res.attendees).to.be.an('array')
		if(JSON.stringify(res.attendees) != JSON.stringify(Schema.properties.attendees.default)){
			res.attendees.map(item => {
				expect(item).to.be.an('object').that.have.any.keys(Schema.definitions.attendees.required)
				expect(item.access).to.be.oneOf(Schema.definitions.attendees.properties.access.enum)
				item.formAccess && expect(item.formAccess).to.be.oneOf(Schema.definitions.attendees.properties.formAccess.enum)
			})
		}
	})
})

