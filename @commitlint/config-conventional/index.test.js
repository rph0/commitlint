import lint from '@commitlint/lint';
import {rules, parserPreset} from '.';

const commitLint = async (message) => {
	const preset = await require(parserPreset)();
	return lint(message, rules, {...preset});
};

const messages = {
	invalidTypeEnum: 'foo: alguma mensagem',
	invalidTypeCase: 'FIX: alguma mensagem',
	invalidTypeEmpty: ': alguma mensagem',
	invalidSubjectCases: [
		'fix(scope): Alguma mensagem',
		'fix(scope): Alguma Mensagem',
		'fix(scope): AlgumaMensagem',
		'fix(scope): ALGUMAMENSAGEM',
	],
	invalidSubjectEmpty: 'fix:',
	invalidSubjectFullStop: 'fix: alguma mensagem.',
	invalidHeaderMaxLength:
		'fix: alguma mensagem muito grande que quebra a regra do máximo de caracteres, o máximo de caracteres é 100',
	warningFooterLeadingBlank:
		'fix: alguma mensagem\n\nbody\nBREAKING CHANGE: mudança significante!',
	invalidFooterMaxLineLength:
		'fix: alguma mensagem\n\nbody\n\nBREAKING CHANGE: rodapé com multiplas linhas\nalguma mensagem muito grande que quebra a regra do máximo de caracteres, o máximo de caracteres é 100',
	warningBodyLeadingBlank: 'fix: alguma mensagem\nbody',
	invalidBodyMaxLineLength:
		'fix: alguma mensagem\n\nbody com multiplas linhas\nguma mensagem muito grande que quebra a regra do máximo de caracteres, o máximo de caracteres é 100',
	validMessages: [
		'fix: alguma mensagem',
		'fix(escopo): alguma mensagem',
		'fix(escopo): alguma Mensagem',
		'fix(escopo): alguma mensagem\n\nBREAKING CHANGE: mudança significante!',
		'fix(escopo): alguma mensagem\n\nbody',
		'fix(escopo)!: alguma mensagem\n\nbody',
	],
};

const errors = {
	typeEnum: {
		level: 2,
		message:
			'tipo deve ser um dos [docs, feat, fix, perf, refactor, style]',
		name: 'type-enum',
		valid: false,
	},
	typeCase: {
		level: 2,
		message: 'tipo deve ser lower-case',
		name: 'type-case',
		valid: false,
	},
	typeEmpty: {
		level: 2,
		message: 'tipo não pode ser vazio',
		name: 'type-empty',
		valid: false,
	},
	subjectCase: {
		level: 2,
		message:
			'descrição não pode ser sentence-case, start-case, pascal-case, upper-case',
		name: 'subject-case',
		valid: false,
	},
	subjectEmpty: {
		level: 2,
		message: 'descrição não pode ser vazia',
		name: 'subject-empty',
		valid: false,
	},
	subjectFullStop: {
		level: 2,
		message: 'subject may not end with full stop',
		name: 'subject-full-stop',
		valid: false,
	},
	headerMaxLength: {
		level: 2,
		message:
			'cabeçalho não pode ter mais de 100 caracteres',
		name: 'header-max-length',
		valid: false,
	},
	footerMaxLineLength: {
		level: 2,
		message: "linhas do rodapé não podem ter mais de 100 caracteres",
		name: 'footer-max-line-length',
		valid: false,
	},
	bodyMaxLineLength: {
		level: 2,
		message: "linhas do corpo da mensagem não podem ter mais de 100 caracteres",
		name: 'body-max-line-length',
		valid: false,
	},
};

const warnings = {
	footerLeadingBlank: {
		level: 1,
		message: 'cabeçalho deve ter uma linha em branco antes',
		name: 'footer-leading-blank',
		valid: false,
	},
	bodyLeadingBlank: {
		level: 1,
		message: 'corpo da mensagem deve ter uma linha em branco antes',
		name: 'body-leading-blank',
		valid: false,
	},
};

test('type-enum', async () => {
	const result = await commitLint(messages.invalidTypeEnum);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.typeEnum]);
});

test('type-case', async () => {
	const result = await commitLint(messages.invalidTypeCase);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.typeCase, errors.typeEnum]);
});

test('type-empty', async () => {
	const result = await commitLint(messages.invalidTypeEmpty);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.typeEmpty]);
});

test('subject-case', async () => {
	const invalidInputs = await Promise.all(
		messages.invalidSubjectCases.map((invalidInput) => commitLint(invalidInput))
	);

	invalidInputs.forEach((result) => {
		expect(result.valid).toBe(false);
		expect(result.errors).toEqual([errors.subjectCase]);
	});
});

test('subject-empty', async () => {
	const result = await commitLint(messages.invalidSubjectEmpty);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.subjectEmpty, errors.typeEmpty]);
});

test('subject-full-stop', async () => {
	const result = await commitLint(messages.invalidSubjectFullStop);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.subjectFullStop]);
});

test('header-max-length', async () => {
	const result = await commitLint(messages.invalidHeaderMaxLength);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.headerMaxLength]);
});

test('footer-leading-blank', async () => {
	const result = await commitLint(messages.warningFooterLeadingBlank, rules);

	expect(result.valid).toBe(true);
	expect(result.warnings).toEqual([warnings.footerLeadingBlank]);
});

test('footer-max-line-length', async () => {
	const result = await commitLint(messages.invalidFooterMaxLineLength);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.footerMaxLineLength]);
});

test('body-leading-blank', async () => {
	const result = await commitLint(messages.warningBodyLeadingBlank);

	expect(result.valid).toBe(true);
	expect(result.warnings).toEqual([warnings.bodyLeadingBlank]);
});

test('body-max-line-length', async () => {
	const result = await commitLint(messages.invalidBodyMaxLineLength);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([errors.bodyMaxLineLength]);
});

test('valid messages', async () => {
	const validInputs = await Promise.all(
		messages.validMessages.map((input) => commitLint(input))
	);

	validInputs.forEach((result) => {
		expect(result.valid).toBe(true);
		expect(result.errors).toEqual([]);
		expect(result.warnings).toEqual([]);
	});
});
