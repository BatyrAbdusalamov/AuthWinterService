'use strict';
/** @type {import('sequelize-cli').Migration} */
const SQL_QUERY_MIGRATE = `
CREATE TABLE public.equipment_classes (
	id serial4 NOT NULL,
	class_id int4 NOT NULL,
	equipment_id int4 NOT NULL,
	CONSTRAINT equipment_classes_pkey PRIMARY KEY (id),
	CONSTRAINT equipment_classes_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id),
	CONSTRAINT equipment_classes_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.equipment(id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('equipment_classes');
  }
};