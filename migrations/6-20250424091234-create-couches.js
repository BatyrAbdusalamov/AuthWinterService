'use strict';
/** @type {import('sequelize-cli').Migration} */
const SQL_QUERY_MIGRATE = `
CREATE TABLE public.couches (
	id serial4 NOT NULL,
	kind_of_sport_id int4 NOT NULL,
	"name" varchar(400) NOT NULL,
	phone_number varchar(400) NOT NULL,
	date_of_birth timestamp NOT NULL,
	"role" int4 NULL,
	"password" varchar(400) NULL,
	"gender" varchar(400) NULL,
	salary_id int4 NULL,
	"qualify" varchar(400) NULL,
	CONSTRAINT couches_pkey PRIMARY KEY (id),
	CONSTRAINT couches_kind_of_sport_id_fkey FOREIGN KEY (kind_of_sport_id) REFERENCES public.kinds_of_sport(id),
	CONSTRAINT couches_role_fkey FOREIGN KEY ("role") REFERENCES public.roles(id),
	CONSTRAINT couches_salary_id_fkey FOREIGN KEY (salary_id) REFERENCES public.coaches_salary(id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('couches');
  }
};