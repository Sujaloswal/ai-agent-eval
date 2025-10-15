-- Manual seed data for user 904c72af-317c-40df-9a9d-6347e5575080
-- Run this in Supabase SQL Editor

-- Insert user config
INSERT INTO user_configs (user_id, run_policy, sample_rate_pct, obfuscate_pii, max_eval_per_day)
VALUES ('904c72af-317c-40df-9a9d-6347e5575080', 'always', 100, true, 1000)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample evaluations
INSERT INTO evaluations (user_id, interaction_id, prompt, response, score, latency_ms, flags, pii_tokens_redacted, created_at) VALUES
('904c72af-317c-40df-9a9d-6347e5575080', 'test-001', 'What is artificial intelligence?', 'AI is the simulation of human intelligence in machines...', 0.85, 250, '{}', 0, NOW() - INTERVAL '1 day'),
('904c72af-317c-40df-9a9d-6347e5575080', 'test-002', 'Explain machine learning', 'Machine learning is a subset of AI that enables computers to learn...', 0.92, 180, '{}', 0, NOW() - INTERVAL '2 days'),
('904c72af-317c-40df-9a9d-6347e5575080', 'test-003', 'What is deep learning?', 'Deep learning uses neural networks with multiple layers...', 0.78, 320, '{}', 0, NOW() - INTERVAL '3 days'),
('904c72af-317c-40df-9a9d-6347e5575080', 'test-004', 'How does natural language processing work?', 'NLP combines computational linguistics with machine learning...', 0.88, 290, '{}', 1, NOW() - INTERVAL '4 days'),
('904c72af-317c-40df-9a9d-6347e5575080', 'test-005', 'What are neural networks?', 'Neural networks are computing systems inspired by biological neural networks...', 0.91, 210, '{}', 0, NOW() - INTERVAL '5 days'),
('904c72af-317c-40df-9a9d-6347e5575080', 'test-006', 'Explain computer vision', 'Computer vision is a field of AI that trains computers to interpret visual information...', 0.83, 275, '{}', 0, NOW() - INTERVAL '6 days'),
('904c72af-317c-40df-9a9d-6347e5575080', 'test-007', 'What is reinforcement learning?', 'Reinforcement learning is a type of machine learning where agents learn through interaction...', 0.76, 340, '{"low_confidence"}', 0, NOW() - INTERVAL '7 days'),
('904c72af-317c-40df-9a9d-6347e5575080', 'test-008', 'How do chatbots work?', 'Chatbots use NLP and machine learning to understand and respond to user queries...', 0.89, 195, '{}', 2, NOW() - INTERVAL '8 days'),
('904c72af-317c-40df-9a9d-6347e5575080', 'test-009', 'What is supervised learning?', 'Supervised learning uses labeled training data to learn a mapping function...', 0.94, 165, '{}', 0, NOW() - INTERVAL '9 days'),
('904c72af-317c-40df-9a9d-6347e5575080', 'test-010', 'Explain unsupervised learning', 'Unsupervised learning finds hidden patterns in data without labeled examples...', 0.87, 225, '{}', 0, NOW() - INTERVAL '10 days');