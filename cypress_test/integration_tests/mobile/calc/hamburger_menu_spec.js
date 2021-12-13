/* global describe it cy Cypress require afterEach expect */

var helper = require('../../common/helper');
var calcHelper = require('../../common/calc_helper');
var mobileHelper = require('../../common/mobile_helper');

describe('Trigger hamburger menu options.', function() {
	var testFileName = '';

	function before(testFile) {
		testFileName = testFile;
		helper.beforeAll(testFileName, 'calc');

		// Click on edit button
		mobileHelper.enableEditingMobile();
	}

	afterEach(function() {
		helper.afterAll(testFileName, this.currentTest.state);
	});

	it('Save', function() {
		before('hamburger_menu.ods');
		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table td')
			.should('contain.text', 'Textx');

		calcHelper.clickOnFirstCell(true, true);

		helper.selectAllText();

		helper.typeIntoDocument('new');

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table td')
			.should('contain.text', 'new');

		mobileHelper.selectHamburgerMenuItem(['File', 'Save']);

		//reset get to original function
		Cypress.Commands.overwrite('get', function(originalFn, selector, options) {
			return originalFn(selector, options);
		});

		// Reopen the document and check content.
		helper.reload(testFileName, 'calc', true);

		mobileHelper.enableEditingMobile();

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table td')
			.should('contain.text', 'new');
	});

	it('Print', function() {
		before('hamburger_menu.ods');

		// A new window should be opened with the PDF.
		helper.getCoolFrameWindow()
			.then(function(win) {
				cy.stub(win, 'open');
			});

		mobileHelper.selectHamburgerMenuItem(['File', 'Print']);

		helper.getCoolFrameWindow()
			.then(function(win) {
				cy.wrap(win).its('open').should('be.called');
			});
	});

	it('Download as PDF', function() {
		before('hamburger_menu.ods');

		mobileHelper.selectHamburgerMenuItem(['Download as', 'PDF Document (.pdf)']);

		cy.get('iframe')
			.should('have.attr', 'data-src')
			.should('contain', 'download');
	});

	it('Download as ODS', function() {
		before('hamburger_menu.ods');

		mobileHelper.selectHamburgerMenuItem(['Download as', 'ODF spreadsheet (.ods)']);

		cy.get('iframe')
			.should('have.attr', 'data-src')
			.should('contain', 'download');
	});

	it('Download as XLS', function() {
		before('hamburger_menu.ods');

		mobileHelper.selectHamburgerMenuItem(['Download as', 'Excel 2003 Spreadsheet (.xls)']);

		cy.get('iframe')
			.should('have.attr', 'data-src')
			.should('contain', 'download');
	});

	it('Download as XLSX', function() {
		before('hamburger_menu.ods');

		mobileHelper.selectHamburgerMenuItem(['Download as', 'Excel Spreadsheet (.xlsx)']);

		cy.get('iframe')
			.should('have.attr', 'data-src')
			.should('contain', 'download');
	});

	it('Undo/redo.', function() {
		before('hamburger_menu.ods');

		// Type a new character
		calcHelper.clickOnFirstCell(true, true);

		cy.get('textarea.clipboard')
			.type('{q}');

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table td')
			.should('contain.text', 'q');

		// Undo
		mobileHelper.selectHamburgerMenuItem(['Edit', 'Undo']);

		cy.get('input#addressInput')
			.should('have.prop', 'value', 'A1');

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table td')
			.should('not.contain.text', 'q');

		// Redo
		mobileHelper.selectHamburgerMenuItem(['Edit', 'Redo']);

		cy.get('input#addressInput')
			.should('have.prop', 'value', 'A1');

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table td')
			.should('contain.text', 'q');
	});

	it('Repair.', function() {
		before('hamburger_menu.ods');

		// Type a new character
		calcHelper.clickOnFirstCell(true, true);
		cy.get('textarea.clipboard')
			.type('{q}');

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table td')
			.should('contain.text', 'q');

		// Revert one undo step via Repair
		mobileHelper.selectHamburgerMenuItem(['Edit', 'Repair']);

		cy.get('.leaflet-popup-content')
			.should('be.visible');

		cy.get('.leaflet-popup-content table tr:nth-of-type(2)')
			.should('contain.text', 'Undo');

		cy.get('.leaflet-popup-content table tr:nth-of-type(2)')
			.click();

		cy.get('.leaflet-popup-content input[value=\'Jump to state\']')
			.click();

		cy.get('input#addressInput')
			.should('have.prop', 'value', 'A1');

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table td')
			.should('not.contain.text', 'q');
	});

	it('Cut.', function() {
		before('hamburger_menu.ods');

		calcHelper.selectEntireSheet();

		mobileHelper.selectHamburgerMenuItem(['Edit', 'Cut']);

		// TODO: cypress does not support clipboard operations
		// so we get a warning dialog here.
		cy.get('.vex-dialog-form')
			.should('be.visible');

		cy.get('.vex-dialog-message')
			.should('have.text', 'Please use the copy/paste buttons on your on-screen keyboard.');

		cy.get('.vex-dialog-button-primary.vex-dialog-button.vex-first')
			.click();

		cy.get('.vex-dialog-form')
			.should('not.exist');
	});

	it('Copy.', function() {
		before('hamburger_menu.ods');

		calcHelper.selectEntireSheet();

		mobileHelper.selectHamburgerMenuItem(['Edit', 'Copy']);

		// TODO: cypress does not support clipboard operations
		// so we get a warning dialog here.
		cy.get('.vex-dialog-form')
			.should('be.visible');

		cy.get('.vex-dialog-message')
			.should('have.text', 'Please use the copy/paste buttons on your on-screen keyboard.');

		cy.get('.vex-dialog-button-primary.vex-dialog-button.vex-first')
			.click();

		cy.get('.vex-dialog-form')
			.should('not.exist');
	});

	it('Paste.', function() {
		before('hamburger_menu.ods');

		calcHelper.selectEntireSheet();

		mobileHelper.selectHamburgerMenuItem(['Edit', 'Paste']);

		// TODO: cypress does not support clipboard operations
		// so we get a warning dialog here.
		cy.get('.vex-dialog-form')
			.should('be.visible');

		cy.get('.vex-dialog-message')
			.should('have.text', 'Please use the copy/paste buttons on your on-screen keyboard.');

		cy.get('.vex-dialog-button-primary.vex-dialog-button.vex-first')
			.click();

		cy.get('.vex-dialog-form')
			.should('not.exist');
	});

	it('Select all.', function() {
		before('hamburger_menu.ods');

		mobileHelper.selectHamburgerMenuItem(['Edit', 'Select All']);

		cy.get('.spreadsheet-cell-resize-marker')
			.should('be.visible');

		cy.get('#copy-paste-container table td')
			.should('contain.text', 'Text');
	});

	it('Search some word.', function() {
		before('hamburger_menu_search.ods');

		mobileHelper.selectHamburgerMenuItem(['Search']);

		// Search bar become visible
		cy.get('#mobile-wizard-content')
			.should('not.be.empty');

		// Search for some word
		helper.inputOnIdle('#searchterm', 'a');

		cy.get('#search')
			.should('not.have.attr', 'disabled');

		helper.clickOnIdle('#search');

		// First cell should be selected
		cy.get('input#addressInput')
			.should('have.prop', 'value', 'A1');
	});

	it('Sheet: insert row before.', function() {
		before('hamburger_menu_sheet.ods');

		calcHelper.clickOnFirstCell();

		mobileHelper.selectHamburgerMenuItem(['Sheet', 'Insert Rows', 'Rows Above']);

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table tr')
			.should('have.length', 3);

		cy.get('#copy-paste-container table tr td:nth-of-type(1)')
			.should(function(cells) {
				expect(cells).to.have.lengthOf(3);
				expect(cells[0]).to.have.text('');
				expect(cells[1]).to.have.text('1');
				expect(cells[2]).to.have.text('3');
			});
	});

	it('Sheet: insert row after.', function() {
		before('hamburger_menu_sheet.ods');

		calcHelper.clickOnFirstCell();

		mobileHelper.selectHamburgerMenuItem(['Sheet', 'Insert Rows', 'Rows Below']);

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table tr')
			.should('have.length', 3);

		cy.get('#copy-paste-container table tr td:nth-of-type(1)')
			.should(function(cells) {
				expect(cells).to.have.lengthOf(3);
				expect(cells[0]).to.have.text('1');
				expect(cells[1]).to.have.text('');
				expect(cells[2]).to.have.text('3');
			});
	});

	it('Sheet: insert column before.', function() {
		before('hamburger_menu_sheet.ods');

		calcHelper.clickOnFirstCell();

		mobileHelper.selectHamburgerMenuItem(['Sheet', 'Insert Columns', 'Columns Before']);

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table tr')
			.should('have.length', 2);

		cy.get('#copy-paste-container table tr:nth-of-type(1) td')
			.should(function(cells) {
				expect(cells).to.have.lengthOf(3);
				expect(cells[0]).to.have.text('');
				expect(cells[1]).to.have.text('1');
				expect(cells[2]).to.have.text('2');
			});
	});

	it('Sheet: insert column after.', function() {
		before('hamburger_menu_sheet.ods');

		calcHelper.clickOnFirstCell();

		mobileHelper.selectHamburgerMenuItem(['Sheet', 'Insert Columns', 'Columns After']);

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table tr')
			.should('have.length', 2);

		cy.get('#copy-paste-container table tr:nth-of-type(1) td')
			.should(function(cells) {
				expect(cells).to.have.lengthOf(3);
				expect(cells[0]).to.have.text('1');
				expect(cells[1]).to.have.text('');
				expect(cells[2]).to.have.text('2');
			});
	});

	it('Sheet: delete rows.', function() {
		before('hamburger_menu_sheet.ods');

		calcHelper.clickOnFirstCell();

		mobileHelper.selectHamburgerMenuItem(['Sheet', 'Delete Rows']);

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table tr')
			.should('have.length', 1);

		cy.get('#copy-paste-container table tr:nth-of-type(1) td')
			.should(function(cells) {
				expect(cells).to.have.lengthOf(2);
				expect(cells[0]).to.have.text('3');
			});
	});

	it('Sheet: delete columns.', function() {
		before('hamburger_menu_sheet.ods');

		calcHelper.clickOnFirstCell();

		mobileHelper.selectHamburgerMenuItem(['Sheet', 'Delete Columns']);

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table tr')
			.should('have.length', 2);

		cy.get('#copy-paste-container table tr:nth-of-type(1) td')
			.should(function(cells) {
				expect(cells).to.have.lengthOf(1);
				expect(cells[0]).to.have.text('2');
			});
	});

	it('Sheet: insert / delete row break.', function() {
		before('hamburger_menu_sheet.ods');

		// Select B2 cell
		calcHelper.clickOnFirstCell();

		cy.get('.spreadsheet-cell-resize-marker')
			.then(function(items) {
				expect(items).to.have.lengthOf(2);
				var marker = items[1];
				var XPos = marker.getBoundingClientRect().right + 2;
				var YPos = marker.getBoundingClientRect().bottom + 2;
				cy.get('body')
					.click(XPos, YPos);

				cy.get('input#addressInput')
					.should('have.prop', 'value', 'B2');
			});

		mobileHelper.selectHamburgerMenuItem(['Sheet', 'Insert Page Break', 'Row Break']);

		// TODO: no visual indicator here
		cy.wait(500);

		mobileHelper.openHamburgerMenu();

		cy.contains('.menu-entry-with-icon', 'Sheet')
			.click();

		cy.contains('.menu-entry-with-icon', 'Delete Page Break')
			.click();

		cy.contains('[title=\'Delete Page Break\'] .menu-entry-with-icon', 'Row Break')
			.click();

		// TODO: no visual indicator here
		cy.wait(500);
	});

	it('Sheet: insert / delete column break.', function() {
		before('hamburger_menu_sheet.ods');

		// Select B2 cell
		calcHelper.clickOnFirstCell();

		cy.get('.spreadsheet-cell-resize-marker')
			.then(function(items) {
				expect(items).to.have.lengthOf(2);
				var marker = items[1];
				var XPos = marker.getBoundingClientRect().right + 2;
				var YPos = marker.getBoundingClientRect().bottom + 2;
				cy.get('body')
					.click(XPos, YPos);

				cy.get('input#addressInput')
					.should('have.prop', 'value', 'B2');
			});

		mobileHelper.selectHamburgerMenuItem(['Sheet', 'Insert Page Break', 'Column Break']);

		// TODO: no visual indicator here
		cy.wait(500);

		mobileHelper.openHamburgerMenu();

		cy.contains('.menu-entry-with-icon', 'Sheet')
			.click();

		cy.contains('.menu-entry-with-icon', 'Delete Page Break')
			.click();

		cy.contains('[title=\'Delete Page Break\'] .menu-entry-with-icon', 'Column Break')
			.click();

		// TODO: no visual indicator here
		cy.wait(500);
	});

	it('Data: sort ascending.', function() {
		before('hamburger_menu_sort.ods');

		// Sort the first column's data
		calcHelper.selectFirstColumn();

		mobileHelper.selectHamburgerMenuItem(['Data', 'Sort Ascending']);

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table tr')
			.should('have.length', 4);

		cy.get('#copy-paste-container table td')
			.should(function(cells) {
				expect(cells).to.have.lengthOf(4);
				expect(cells[0]).to.have.text('1');
				expect(cells[1]).to.have.text('2');
				expect(cells[2]).to.have.text('3');
				expect(cells[3]).to.have.text('4');
			});
	});

	it('Data: sort descending.', function() {
		before('hamburger_menu_sort.ods');

		// Sort the first column's data
		calcHelper.selectFirstColumn();

		mobileHelper.selectHamburgerMenuItem(['Data', 'Sort Descending']);

		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table tr')
			.should('have.length', 4);

		cy.get('#copy-paste-container table td')
			.should(function(cells) {
				expect(cells).to.have.lengthOf(4);
				expect(cells[0]).to.have.text('4');
				expect(cells[1]).to.have.text('3');
				expect(cells[2]).to.have.text('2');
				expect(cells[3]).to.have.text('1');
			});
	});

	it('Data: grouping / ungrouping.', function() {
		before('hamburger_menu.ods');

		// Group first
		calcHelper.selectFirstColumn();

		mobileHelper.selectHamburgerMenuItem(['Data', 'Group and Outline', 'Group...']);

		cy.get('[id="test-div-column group"]').should('exist');

		// Then ungroup
		mobileHelper.selectHamburgerMenuItem(['Data', 'Group and Outline', 'Ungroup...']);

		cy.get('[id="test-div-column group"]').should('not.exist');
	});

	it('Data: remove grouping outline.', function() {
		before('hamburger_menu.ods');

		// Group first
		calcHelper.selectFirstColumn();

		mobileHelper.selectHamburgerMenuItem(['Data', 'Group and Outline', 'Group...']);

		cy.get('[id="test-div-column group"]').should('exist');

		// Then remove outline
		mobileHelper.selectHamburgerMenuItem(['Data', 'Group and Outline', 'Remove Outline']);

		cy.get('[id="test-div-column group"]').should('not.exist');
	});

	it('Data: show / hide grouping details.', function() {
		before('hamburger_menu.ods');

		// Group first
		calcHelper.selectFirstColumn();

		mobileHelper.selectHamburgerMenuItem(['Data', 'Group and Outline', 'Group...']);

		cy.get('[id="test-div-column group"]').should('exist');

		// Use selected content as indicator
		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table')
			.should('exist');

		// Hide details
		mobileHelper.selectHamburgerMenuItem(['Data', 'Group and Outline', 'Hide Details']);

		// Frist column is hidden -> no content
		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table')
			.should('not.exist');

		// Show details
		mobileHelper.selectHamburgerMenuItem(['Data', 'Group and Outline', 'Show Details']);

		// Frist column is visible again -> we have content again
		calcHelper.selectEntireSheet();

		cy.get('#copy-paste-container table')
			.should('exist');
	});

	it('Check version information.', function() {
		before('hamburger_menu.ods');

		mobileHelper.selectHamburgerMenuItem(['About']);

		cy.get('.vex-content')
			.should('exist');

		// Check the version
		cy.contains('#lokit-version', 'Collabora Office')
			.should('exist');

		// Close about dialog
		cy.get('.vex-close')
			.click({force : true});

		cy.get('.vex-content')
			.should('not.exist');
	});
});
