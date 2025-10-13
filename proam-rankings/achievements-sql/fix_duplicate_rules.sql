-- Deactivate duplicate achievement rules (run this in Supabase SQL Editor)
UPDATE achievement_rules
SET is_active = false
WHERE id IN (
  '35310c1f-14aa-4ed8-95e4-4b833202400c',
  '2be27db2-1c13-4961-92d5-e3fb1323c506',
  '21fc9e70-b396-4432-aced-6511a6416d29',
  '55a2789e-3298-455e-9aa3-1458d3c36510',
  '78fc2f16-7246-47c9-a679-4d07d3e6f291',
  '342bfdc4-7422-41a7-9c3a-c08d7f70eaa3',
  'ec0da408-756c-47c8-aa46-1d6c05730b58',
  '151f6743-aaa3-47d8-b232-ce67b68f658f',
  '196a2227-f602-4941-a742-17f8855b8193',
  '0d33dbe4-fffd-4042-a9f6-4755ec9bf251',
  'f3b96ac8-9364-469c-b1a0-4544f717605a',
  'c84ee74c-793f-484b-add2-d42414f850f2',
  'c5c6f1e3-bc15-420c-9091-d7dcf30975e9',
  '164be2de-e91d-45c5-8a46-4c889e690ade',
  'd42a24a3-261c-425e-a9f5-0e6d1f7e7330',
  '2227e5f6-a3d7-4a09-ae9a-6616358f4765'
);

