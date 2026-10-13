/**
 * GATE-BOT — Visual Renderer Module
 * File: js/gatebot/gatebotRenderer.js
 * Renders Gate Barrier, Inspection Booth, Truth Tables, and Visitor Decision Worksheets
 */

(function() {
    'use strict';

    class GateBotRenderer {
        constructor(domElements) {
            this.dom = domElements;
        }

        renderLevelInfo(lvl) {
            if (this.dom.activeLvlLabel) {
                this.dom.activeLvlLabel.textContent = `Level ${lvl.id}`;
            }
            if (this.dom.missionContent) {
                this.dom.missionContent.innerHTML = `
                    <div class="mission-headline">${lvl.headline}</div>
                    <div class="mission-body-text">${lvl.desc}</div>
                `;
            }
            if (this.dom.targetRuleText) {
                this.dom.targetRuleText.innerHTML = `
                    <div class="rule-title-pill">🎯 ATURAN LOGIKA GERBANG:</div>
                    <div class="blueprint-code-block">
                        <div class="blueprint-code-line">
                            <span class="bp-kw">JIKA</span> ( <code class="bp-expr">${lvl.logicExpression}</code> ) <span class="bp-kw">MAKA</span>
                        </div>
                        <div class="blueprint-code-line bp-indent">
                            <span class="bp-arrow">➔</span> <span class="bp-action">Buka Gerbang</span> <span class="bp-val-true">TRUE 🟢</span>
                        </div>
                        <div class="blueprint-code-line">
                            <span class="bp-kw bp-kw-else">LAINNYA (SELAIN ITU)</span>
                        </div>
                        <div class="blueprint-code-line bp-indent">
                            <span class="bp-arrow">➔</span> <span class="bp-action">Kunci Gerbang</span> <span class="bp-val-false">FALSE 🔴</span>
                        </div>
                    </div>
                    <div class="rule-concept-box">💡 <strong>Konsep Logika:</strong> ${lvl.conceptSummary}</div>
                `;
            }
            if (this.dom.allowedAttrsPills) {
                this.dom.allowedAttrsPills.innerHTML = lvl.allowedAttributes.map(a => `
                    <span class="attr-token-pill">
                        <span class="attr-icon">${a.icon}</span>
                        <code class="attr-code">${a.key}</code>
                        <span class="attr-label">(${a.label})</span>
                    </span>
                `).join('');
            }
        }

        renderVisitorWorksheet(lvl, userDecisions, onSelectCallback) {
            if (!this.dom.visitorQueueList) return;

            this.dom.visitorQueueList.innerHTML = lvl.visitors.map((v, i) => {
                const currentChoice = userDecisions[i]; // true, false, or null

                const attrPills = lvl.allowedAttributes.map(a => {
                    const isTrue = Boolean(v.attributes[a.key]);
                    return `
                        <span class="queue-attr-badge ${isTrue ? 'badge-true' : 'badge-false'}">
                            ${a.icon} ${a.key} = <strong>${isTrue ? 'TRUE' : 'FALSE'}</strong>
                        </span>
                    `;
                }).join('');

                const isAnswered = currentChoice !== null && currentChoice !== undefined;

                return `
                    <div class="visitor-question-card ${isAnswered ? 'card-answered' : ''}" id="vis-card-${i}">
                        <div class="vis-card-top">
                            <div class="vis-profile">
                                <span class="vis-avatar">${v.avatar}</span>
                                <div>
                                    <span class="vis-name">Soal ${i + 1}: ${v.name}</span>
                                    <div class="vis-role">Pengunjung #${i + 1}</div>
                                </div>
                            </div>
                            <span class="vis-status-badge" id="vis-badge-${i}">
                                ${isAnswered ? '⌛ Siap Diuji' : '⏳ Belum Dipilih'}
                            </span>
                        </div>

                        <div class="vis-card-attrs">
                            <span class="attrs-label">Kondisi yang Dibawa:</span>
                            <div class="attrs-row">${attrPills}</div>
                        </div>

                        <div class="vis-decision-section">
                            <span class="decision-prompt">Keputusan Gerbang Menurutmu:</span>
                            <div class="decision-buttons-row">
                                <button type="button" 
                                        class="btn-decision-choice btn-choice-true ${currentChoice === true ? 'active-true' : ''}" 
                                        data-visitor="${i}" 
                                        data-val="true">
                                    🟢 TRUE (Buka)
                                </button>
                                <button type="button" 
                                        class="btn-decision-choice btn-choice-false ${currentChoice === false ? 'active-false' : ''}" 
                                        data-visitor="${i}" 
                                        data-val="false">
                                    🔴 FALSE (Kunci)
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Bind click events
            this.dom.visitorQueueList.querySelectorAll('.btn-decision-choice').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const vIdx = parseInt(e.currentTarget.dataset.visitor, 10);
                    const val = (e.currentTarget.dataset.val === 'true');
                    onSelectCallback(vIdx, val);
                });
            });
        }

        updateCardChoiceUI(visitorIdx, val) {
            const card = document.getElementById(`vis-card-${visitorIdx}`);
            const badge = document.getElementById(`vis-badge-${visitorIdx}`);
            if (!card) return;

            card.classList.add('card-answered');
            if (badge) {
                badge.textContent = '⌛ Siap Diuji';
                badge.className = 'vis-status-badge badge-ready';
            }

            const btnTrue = card.querySelector('.btn-choice-true');
            const btnFalse = card.querySelector('.btn-choice-false');
            if (btnTrue && btnFalse) {
                if (val === true) {
                    btnTrue.classList.add('active-true');
                    btnFalse.classList.remove('active-false');
                } else {
                    btnFalse.classList.add('active-false');
                    btnTrue.classList.remove('active-true');
                }
            }
        }

        setGateState(state, text = '') {
            if (!this.dom.gateArm || !this.dom.gateLightBulb || !this.dom.gateStatusText) return;

            if (state === 'OPEN') {
                this.dom.gateArm.classList.add('gate-arm-open');
                this.dom.gateLightBulb.className = 'status-bulb bulb-green';
                this.dom.gateStatusText.textContent = text || 'GERBANG TERBUKA (TRUE)';
                this.dom.gateStatusText.style.color = '#4ade80';
                if (this.dom.botEyes) this.dom.botEyes.textContent = '^_^';
                if (this.dom.botStatusTag) this.dom.botStatusTag.textContent = 'Akses Lolos ➔ TRUE 🟢';
            } else if (state === 'CLOSED') {
                this.dom.gateArm.classList.remove('gate-arm-open');
                this.dom.gateLightBulb.className = 'status-bulb bulb-red';
                this.dom.gateStatusText.textContent = text || 'GERBANG TERKUNCI (FALSE)';
                this.dom.gateStatusText.style.color = '#f87171';
                if (this.dom.botEyes) this.dom.botEyes.textContent = 'x_x';
                if (this.dom.botStatusTag) this.dom.botStatusTag.textContent = 'Akses Ditolak ➔ FALSE 🔴';
            } else if (state === 'CHECKING') {
                this.dom.gateArm.classList.remove('gate-arm-open');
                this.dom.gateLightBulb.className = 'status-bulb bulb-yellow';
                this.dom.gateStatusText.textContent = text || 'MENGHITUNG LOGIKA...';
                this.dom.gateStatusText.style.color = '#facc15';
                if (this.dom.botEyes) this.dom.botEyes.textContent = 'o_o';
                if (this.dom.botStatusTag) this.dom.botStatusTag.textContent = 'Mengecek Sensor 🟡';
            } else {
                this.dom.gateArm.classList.remove('gate-arm-open');
                this.dom.gateLightBulb.className = 'status-bulb bulb-off';
                this.dom.gateStatusText.textContent = text || 'GERBANG SIAP';
                this.dom.gateStatusText.style.color = '#94a3b8';
                if (this.dom.botEyes) this.dom.botEyes.textContent = 'o_o';
                if (this.dom.botStatusTag) this.dom.botStatusTag.textContent = 'Siaga 🦾';
            }
        }

        renderActiveBooth(visitor, visitorIdx, lvl, equationStr, userChoice) {
            if (!this.dom.currentVisitorCard) return;
            this.dom.currentVisitorCard.innerHTML = `
                <div class="booth-visitor-profile">
                    <span class="booth-vis-avatar">${visitor.avatar}</span>
                    <div class="booth-vis-info">
                        <span class="booth-vis-name">${visitor.name}</span>
                        <span class="booth-vis-tag">Pengunjung #${visitorIdx + 1} · Pilihanmu: <strong>${userChoice !== null ? (userChoice ? 'TRUE (Buka)' : 'FALSE (Tolak)') : 'Belum'}</strong></span>
                    </div>
                </div>
                <div class="booth-vis-attrs">
                    ${lvl.allowedAttributes.map(a => {
                        const val = Boolean(visitor.attributes[a.key]);
                        return `<span class="booth-attr-chip ${val ? 'chip-true' : 'chip-false'}">${a.icon} ${a.key} = <strong>${val ? 'TRUE' : 'FALSE'}</strong></span>`;
                    }).join('')}
                </div>
                ${equationStr ? `<div class="booth-equation-bar">📐 ${equationStr}</div>` : ''}
            `;
        }

        resetQueueVisuals(lvl, userDecisions) {
            lvl.visitors.forEach((_, i) => {
                const card = document.getElementById(`vis-card-${i}`);
                const badge = document.getElementById(`vis-badge-${i}`);
                if (card) {
                    card.classList.remove('vis-active', 'vis-passed', 'vis-failed');
                }
                if (badge) {
                    const isAnswered = userDecisions[i] !== null;
                    badge.textContent = isAnswered ? '⌛ Siap Diuji' : '⏳ Belum Dipilih';
                    badge.className = `vis-status-badge ${isAnswered ? 'badge-ready' : ''}`;
                }
            });
            if (this.dom.currentVisitorCard) {
                this.dom.currentVisitorCard.innerHTML = `<span class="empty-booth-text">Tentukan pilihan TRUE / FALSE untuk setiap anak lalu jalankan robot.</span>`;
            }
        }
    }

    if (typeof window !== 'undefined') {
        window.GateBotRenderer = GateBotRenderer;
    }
})();
